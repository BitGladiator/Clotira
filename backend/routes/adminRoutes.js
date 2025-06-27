const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();
//@router GET /api/admin/users
//@desc get al users (Admin only request)
//access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sever Error" });
  }
});
//@router POST /api/admin/users
//@desc add a new user (admin only)
//access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User already exists" });
    }
    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });
    await user.save();
    res.status(201).json({ user }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
//@router PUT /api/admin/users/:id
//@desc update user information (Admin only) -name ,email and role
//access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }
    const UpdatedUser = await user.save();
    res.json({ message: "User updated succesfully", user: UpdatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
//@router PUT /api/admin/users/:id
//@desc Delete a user
//access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User Deleted Successfully" });
    } else {
      res.status(404).json({ message: "User Not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
