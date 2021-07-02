import User from "../models/User";
import Role from "../models/Role";

export const createUser = async (req, res) => {
  try {
    const { username, dni, email, cargo, password, roles } = req.body;
    const rolesFound = await Role.find({ name: { $in: roles } });

    // creating a new User
    const user = new User({
      username,
      dni,
      email,
      cargo,
      password,
      roles: rolesFound.map((role) => role._id),
    });

    // encrypting password
    if (req.body.password) {
      user.password = await User.encryptPassword(user.password);
    }
    
    // saving the new user
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
      saved: true
    });
  } catch (error) {
    console.error(error);
  }
};

export const filterUsers = async (req, res) => {
  try {
    const { name } = req.params
    const users = await User.find().select('username')
    const filteredUsers = users.filter(user => {
      return user.toString().toLowerCase().indexOf(name.toLowerCase()) >= 0
    })
    res.status(200).json(filteredUsers)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    return res.status(500).json(error)
  }
}