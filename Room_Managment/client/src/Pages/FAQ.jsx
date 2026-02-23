import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import 'material-icons/iconfont/material-icons.css';

const FAQ = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // User/Owner States
  const [myFAQs, setMyFAQs] = useState([]);
  const [createForm, setCreateForm] = useState({ question: '', category: 'general' });
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Admin States
  const [allFAQs, setAllFAQs] = useState([]);
  const [selectedAdminFAQ, setSelectedAdminFAQ] = useState(null);
  const [filters, setFilters] = useState({ status: '', category: '', role: '' });
  const [answerForm, setAnswerForm] = useState({ answer: '' });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Get auth headers
  const getAuthHeaders = () => {
    const token = Cookies.get('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Load user on mount
  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
        
        // Load data based on role
        if (parsedUser.role === 'user' || parsedUser.role === 'owner') {
          fetchMyFAQs();
        } else if (parsedUser.role === 'admin') {
          fetchAllFAQs();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      navigate('/login');
    }
  }, []);

  // ========== USER/OWNER API CALLS ==========

  // Create FAQ
  const createFAQ = async (e) => {
    e.preventDefault();
    if (!createForm.question) {
      showMessage('error', 'Please enter a question');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/faq/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(createForm)
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', '✅ FAQ created successfully');
        setCreateForm({ question: '', category: 'general' });
        setShowCreateModal(false);
        fetchMyFAQs();
      } else {
        showMessage('error', data.message || 'Failed to create FAQ');
      }
    } catch (error) {
      showMessage('error', 'Error creating FAQ');
    } finally {
      setLoading(false);
    }
  };

  // Get My FAQs
  const fetchMyFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/faq/my-faqs`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok) {
        setMyFAQs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get FAQ by ID (User/Owner)
  const fetchFAQById = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/faq/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedFAQ(data.data);
      }
    } catch (error) {
      showMessage('error', 'Error fetching FAQ details');
    } finally {
      setLoading(false);
    }
  };

  // ========== ADMIN API CALLS ==========

  // Get All FAQs (Admin)
  const fetchAllFAQs = async () => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/faq/`;
      
      // Add filters if any
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.role) params.append('role', filters.role);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok) {
        setAllFAQs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching all FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Admin Change Status
  const changeFAQStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/faq/status/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', `✅ Status changed to ${status}`);
        if (selectedAdminFAQ) {
          setSelectedAdminFAQ({ ...selectedAdminFAQ, status });
        }
        fetchAllFAQs();
      } else {
        showMessage('error', data.message || 'Failed to change status');
      }
    } catch (error) {
      showMessage('error', 'Error changing status');
    } finally {
      setLoading(false);
    }
  };

  // Admin Add Answer
  const addAnswer = async (id) => {
    if (!answerForm.answer) {
      showMessage('error', 'Please enter an answer');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/faq/${id}/answer`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ answer: answerForm.answer })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', '✅ Answer added successfully');
        setAnswerForm({ answer: '' });
        if (selectedAdminFAQ) {
          setSelectedAdminFAQ({ ...selectedAdminFAQ, answer: answerForm.answer, status: 'completed' });
        }
        fetchAllFAQs();
      } else {
        showMessage('error', data.message || 'Failed to add answer');
      }
    } catch (error) {
      showMessage('error', 'Error adding answer');
    } finally {
      setLoading(false);
    }
  };

  // Admin click FAQ - auto update status to 'view'
  const handleAdminFAQClick = async (faq) => {
    try {
      setLoading(true);
      
      // If status is 'unseen', update to 'view' first
      if (faq.status === 'unseen') {
        await changeFAQStatus(faq._id, 'view');
      }
      
      // Then fetch the updated FAQ details
      const response = await fetch(`${BASE_URL}/faq/${faq._id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedAdminFAQ(data.data);
      }
    } catch (error) {
      showMessage('error', 'Error fetching FAQ details');
    } finally {
      setLoading(false);
    }
  };

  // Helper Functions
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getStatusBadge = (status) => {
    const colors = {
      unseen: 'bg-gray-100 text-gray-700',
      view: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If user is admin, show admin view
  if (user.role === 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
              Admin FAQ Management
            </h1>
            <p className="text-gray-600 mt-1">Manage all user FAQs</p>
          </div>
          <div className="bg-red-100 px-4 py-2 rounded-lg">
            <span className="text-red-700 font-medium">Admin</span>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Filter FAQs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">All Status</option>
              <option value="unseen">Unseen</option>
              <option value="view">Viewed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="support">Support</option>
            </select>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </select>
            <button
              onClick={fetchAllFAQs}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-medium hover:shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* FAQs Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-yellow-200 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFAQs.map((faq) => (
              <div
                key={faq._id}
                onClick={() => handleAdminFAQClick(faq)}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(faq.status)}`}>
                    {faq.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {faq.role}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{faq.question}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  By: {faq.name} | {formatDate(faq.createdAt)}
                </p>
                {faq.answer && (
                  <p className="text-xs text-green-600 mt-2 line-clamp-2">
                    ✓ Answered: {faq.answer.substring(0, 50)}...
                  </p>
                )}
              </div>
            ))}
            {allFAQs.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No FAQs found</p>
              </div>
            )}
          </div>
        )}

        {/* Admin FAQ Detail Modal */}
        {selectedAdminFAQ && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-xl font-bold text-gray-900">FAQ Details</h2>
                <button
                  onClick={() => {
                    setSelectedAdminFAQ(null);
                    setAnswerForm({ answer: '' });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* User Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{selectedAdminFAQ.name}</p>
                  <p className="text-xs text-gray-500">Role: {selectedAdminFAQ.role}</p>
                  <p className="text-xs text-gray-500">Category: {selectedAdminFAQ.category}</p>
                  <p className="text-xs text-gray-500">Created: {formatDate(selectedAdminFAQ.createdAt)}</p>
                </div>

                {/* Question */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-xs font-medium text-yellow-800 mb-1">Question:</p>
                  <p className="text-sm text-gray-900">{selectedAdminFAQ.question}</p>
                </div>

                {/* Current Status */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Current Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedAdminFAQ.status)}`}>
                    {selectedAdminFAQ.status}
                  </span>
                </div>

                {/* Change Status - Only pending and completed */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Change Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => changeFAQStatus(selectedAdminFAQ._id, status)}
                        disabled={selectedAdminFAQ.status === status}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedAdminFAQ.status === status
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Answer Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Answer</h3>
                  {selectedAdminFAQ.answer ? (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-3">
                      <p className="text-sm text-gray-900">{selectedAdminFAQ.answer}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mb-3">No answer yet</p>
                  )}
                  
                  <textarea
                    value={answerForm.answer}
                    onChange={(e) => setAnswerForm({ answer: e.target.value })}
                    placeholder="Write your answer here..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none mb-2"
                  />
                  <button
                    onClick={() => addAnswer(selectedAdminFAQ._id)}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-medium hover:shadow-md disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Answer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== USER/OWNER VIEW ==========
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
            My FAQs
          </h1>
          <p className="text-gray-600 mt-1">View and manage your questions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-medium hover:shadow-md flex items-center gap-2"
        >
          <span className="material-icons text-sm">add</span>
          Ask Question
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* My FAQs List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-yellow-200 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myFAQs.map((faq) => (
            <div
              key={faq._id}
              onClick={() => fetchFAQById(faq._id)}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(faq.status)}`}>
                  {faq.status}
                </span>
                <span className="text-xs text-gray-500">
                  {faq.category}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{faq.question}</h3>
              <p className="text-xs text-gray-500 mb-2">
                Asked: {formatDate(faq.createdAt)}
              </p>
              {faq.answer && (
                <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs text-green-700">✓ Answer: {faq.answer}</p>
                </div>
              )}
            </div>
          ))}
          {myFAQs.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
              <span className="material-icons text-4xl text-gray-300 mb-2">help</span>
              <p className="text-gray-500">No FAQs yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-2 text-yellow-600 hover:text-red-600 text-sm font-medium"
              >
                Ask your first question
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create FAQ Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Ask a Question</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={createFAQ} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={createForm.question}
                  onChange={(e) => setCreateForm({ ...createForm, question: e.target.value })}
                  placeholder="Type your question here..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="support">Support</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-medium hover:shadow-md disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Question'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Detail Modal */}
      {selectedFAQ && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">FAQ Details</h2>
              <button
                onClick={() => setSelectedFAQ(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedFAQ.status)}`}>
                  {selectedFAQ.status}
                </span>
                <span className="text-xs text-gray-500">{selectedFAQ.category}</span>
              </div>

              {/* Question */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-xs font-medium text-yellow-800 mb-1">Your Question:</p>
                <p className="text-sm text-gray-900">{selectedFAQ.question}</p>
                <p className="text-xs text-gray-500 mt-2">Asked: {formatDate(selectedFAQ.createdAt)}</p>
              </div>

              {/* Answer */}
              {selectedFAQ.answer ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-800 mb-1">Answer:</p>
                  <p className="text-sm text-gray-900">{selectedFAQ.answer}</p>
                  {selectedFAQ.updatedAt !== selectedFAQ.createdAt && (
                    <p className="text-xs text-gray-500 mt-2">Answered: {formatDate(selectedFAQ.updatedAt)}</p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500 text-center">No answer yet. Check back later.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;