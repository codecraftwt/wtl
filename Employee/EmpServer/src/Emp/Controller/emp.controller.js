const Employee = require("../../Emp/model/emp.model");


//create 
exports.createEmployee= async(req,res)=>{
    const employee=await Employee.create(req.body);
    res.status(201).json(employee)
}

//get
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find(); 
    res.json(employees);                      
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateEmployee = async (req, res) => { 
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id, 
      req.body,      
      { new: true }  
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//Delete
exports.deleteEmployee=async(req,res)=>{
    await Employee.findByIdAndDelete(req.params.id);
    res.json({message:"Deleted"})
}
