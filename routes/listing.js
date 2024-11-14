const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn} = require("../middleware");
const {isOwner} = require("../middleware");
const {validateListing} = require("../middleware");
const multer = require("multer");

const {storage} = require("../cloudConfig");
const upload = multer({storage})
 
const listingController = require("../controllers/listings");

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync( listingController.createListing ))


// NEW LISTING

router.get("/new",isLoggedIn,listingController.renderNewForm)

router
.route("/:id")
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing ))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing ))
.get(wrapAsync(listingController.showListing))


// EDIT LISTING

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingController.renderEditForm )
)

// export
module.exports = router;