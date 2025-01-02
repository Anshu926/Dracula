// Environment setup for development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const port = 4065;
const path = require("path");
const connect_db = require("./connect_db");
const User_Model = require("./schema_&_model");
const methodOverride = require("method-override");
const sessionMiddleware = require('./sessionMiddleware'); // Path to your sessionMiddleware
const flash = require("connect-flash");
const multer = require('multer');
const { storage } = require('./cloudinary'); // Cloudinary configuration
const upload = multer({ storage }); // Use Cloudinary for file storage

// Database connection
connect_db();

// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session middleware
app.use(sessionMiddleware);

// Flash middleware
app.use(flash());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.successMessage = req.flash("success")[0];
    res.locals.errorMessage = req.flash("error")[0];
    next();
});

// Root route
app.get("/", (req, res) => {  
    res.send("<h1>I am a lord </h1>");
});

// Home Route: Display all users
app.get("/home", async (req, res) => {
    try {
        const users = await User_Model.find();
        res.render("home.ejs", { users });
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).send("Error fetching users");
    }
});

// Show user details route
app.get("/show/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_Model.findById(id);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/home");
        }

        res.render("show.ejs", { user });
    } catch (err) {
        console.error("Error fetching user:", err.message);
        req.flash("error", "Failed to fetch user details.");
        res.redirect("/home");
    }
});

// Show create user form
app.get("/create_user", (req, res) => {
    res.render("create.ejs");
});

// Create user route (POST)
app.post("/create_user", upload.single('image'), async (req, res) => {
    try {
        const { name, email, age } = req.body;

        if (!name || !email || !age) {
            req.flash("error", "All fields are required.");
            return res.redirect("/create_user");
        }

        const imageUrl = req.file ? req.file.path : undefined; // URL from Cloudinary

        const newUser = new User_Model({ name, email, age, image: imageUrl });
        await newUser.save();

        req.flash("success", "User created successfully!");
        res.redirect("/home");
    } catch (err) {
        console.error("Error creating user:", err.message);
        req.flash("error", "Failed to create user.");
        res.redirect("/create_user");
    }
});

// Render update form
app.get("/update_user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_Model.findById(id);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/home");
        }

        res.render("update.ejs", { user });
    } catch (err) {
        console.error("Error fetching user for update:", err.message);
        req.flash("error", "Failed to fetch user for update.");
        res.redirect("/home");
    }
});

// Update user route (PUT)
app.put("/update_user/:id", upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age } = req.body;

        if (!name || !email || !age) {
            req.flash("error", "All fields are required.");
            return res.redirect(`/update_user/${id}`);
        }

        const imageUrl = req.file ? req.file.path : undefined;

        const updatedUser = await User_Model.findByIdAndUpdate(
            id,
            { name, email, age, image: imageUrl || undefined },
            { new: true }
        );

        if (!updatedUser) {
            req.flash("error", "User not found.");
            return res.redirect("/home");
        }

        req.flash("success", "User updated successfully!");
        res.redirect(`/show/${updatedUser._id}`);
    } catch (err) {
        console.error("Error updating user:", err.message);
        req.flash("error", "Failed to update user.");
        res.redirect("/home");
    }
});

// Delete user route
app.delete("/delete_user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User_Model.findByIdAndDelete(id);

        if (!deletedUser) {
            req.flash("error", "User not found.");
            return res.redirect("/home");
        }

        req.flash("success", "User deleted successfully!");
        res.redirect("/home");
    } catch (err) {
        console.error("Error deleting user:", err.message);
        req.flash("error", "Failed to delete user.");
        res.redirect("/home");
    }
});

// Founder route
app.get("/about", (req, res) => {
    res.render("about.ejs");
});

// Universal 404 route
app.get("*", (req, res) => {
    req.flash("error", "Page not found!");
    res.status(404).render("universal.ejs", {
        errorMessage: req.flash("error")[0],
    });
});

// Start server
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});


