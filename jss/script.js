// hotel data
/*
Brothel,Location,CouplesMax,GroupsMax,CouplesPrice,GroupsPrice,Discount
Crimson Citadel,Coventry,5,8,110,210,10
Ebony Woods,Erdington,10,26,90,160,8
Sapphire Suties,Sommerset,20,12,150,250,15
*/


// hotel constructor
function Hotel(name, location, couplesMax, groupsMax, couplesPrice, groupsPrice, discount) {
    // set object variables
    this.name = name;
    this.location = location;
    this.couplesMax = couplesMax;
    this.groupsMax = groupsMax;
    this.couplesPrice = couplesPrice;
    this.groupsPrice = groupsPrice;
    this.discount = discount;
    
    // set random number of available rooms
    this.couplesFree = Math.floor(Math.random() * this.couplesMax);
    this.groupsFree = Math.floor(Math.random() * this.groupsMax);
    this.couplesBooked = this.couplesMax - this.couplesFree;
    this.groupsBooked = this.groupsMax - this.groupsFree;
    
    // set methods
    this.bookCouplesRooms = function (amount) {
        var couplesRoomsBooked = 0;
        
        if (amount > 0) {
            if (this.couplesBooked + amount < this.couplesMax) {
                this.couplesBooked += amount;
                this.couplesFree -= amount;
                couplesRoomsBooked += amount;
            }
        }
        
        return couplesRoomsBooked;
        
    };
    
    this.bookGroupsRooms = function (amount) {
        var groupsRoomsBooked = 0, couplesRoomsBooked = 0;
        
        if (amount > 0) {
            if (this.groupsBooked + amount < this.groupsMax) {
                this.groupsBooked += amount;
                this.groupsFree -= amount;
                groupsRoomsBooked += amount;
            } else {
                groupsRoomsBooked += this.groupsMax = this.groupsBooked;
                couplesRoomsBooked += this.BookCouplesRooms(amount - groupsRoomsBooked);
            }
        }
        
        return { groupsRoomsBooked : groupsRoomsBooked,
                couplesRoomsBooked : couplesRoomsBooked };
    };
}

// load csv when page loads
document.body.onload = function () {
    // load data, build objects and store in an array
    var hotelList = [],
        i = 0, tmp = "",
        elHotelList = document.getElementById("hotelList"),
        optHotelList = [];
    
    hotelList.push(new Hotel("Crimson Citadel", "Coventry", 5, 8, 110, 210, 10));
    hotelList.push(new Hotel("Ebony Woods", "Erdington", 10, 26, 90, 160, 8));
    hotelList.push(new Hotel("Sapphire Suites", "Sommerset", 20, 12, 150, 250, 15));
    
    // update form elements
    
    // remove existing options
    if (elHotelList.length > 1) {
        for (i = 0; i <= elHotelList.length; i++) {
            elHotelList.remove(i+1);
        }
    }
    
    // fill list with options from hotel array
    for (i = 0; i <= hotelList.length; i++) {
        optHotelList.push (document.createElement("option"));
        optHotelList[i].text = hotelList[i].name;
        tmp = hotelList[i].name.substr(0, hotelList[i].name.indexOf(" "));
        optHotelList[i].value = tmp.toLowerCase();
        elHotelList.add(optHotelList[i]);
    }
};
    
function msgBox(msg, status) {
    // grab messages box
    var msgBox   = document.getElementById("msg"),
        msgTitle = document.getElementById("msgTitle"),
        msgList  = document.getElementById("msgList"),
        node     = document.createElement("LI"),
        textNode = document.createTextNode(msg);
    
    // show message box
    if (msgBox.classList.contains("hidden")) {
        msgBox.classList.remove("hidden");
    }
    
    // insert title
    if (msgList.hasChildNodes()) {
        switch (status.toLowerCase()) {
            case "bad":
                msgTitle.textContent = "Error Messages;";
                break;
            case "good":
                msgTitle.textContent = "Success;";
                break;
            case "ugly":
                msgTitle.textContent = "Opps! I dun goofed.";
                break;
            default:
                // pretty :)
                msgTitle.textContent = "Notices;";
        }
    }
    
    // add messages
    node.appendChild(textNode);
    msgList.appendChild(node);
}

function checkElement(elementID) {
    var element = document.getElementById(elementID),
        msg = "", status = "";
    
    switch (elementID) {
        case "title":
            if (element.options.selectedIndex == 0) {
                msg = elementID.toUpperCase() + " - Please select a Title.";
                status = "bad";
            }
            break;
            
        case "forename":
            if (element.value.length < 2) {
                msg = elementID.toUpperCase() + " - This field can not be left blank.";
                status = "bad";
            }
            break;
        
        case "surname":
            if (element.value.length < 2) {
                msg = elementID.toUpperCase() + " - This field can not be left blank.";
                status = "bad";
            }
            break;
            
        case "email":
            if (element.value.length < 2) {
                msg = elementID.toUpperCase() + " - This field can not be left blank.";
                status = "bad";
            }
            break;
            
        case "phone":
            if (element.value.length < 2) {
                msg = elementID.toUpperCase() + " - This field can not be left blank.";
                status = "bad";
            }
            break;
            
        case "address":
            if (element.value.length < 2) {
                msg = elementID.toUpperCase() + " - This field can not be left blank.";
                status = "bad";
            }
            break;
            
        case "hotelList":
            if (element.options.selectedIndex == 0) {
                msg = elementID.toUpperCase() + " - Please select a Venue.";
                status = "bad";
            }break;
        
        case "party":
            if (element.value.length < 1) {
                msg = elementID.toUpperCase() + " - This field can not be left blank.";
                status = "bad";
            }
            if (element.value.isNAN) {
                msg = elementID.toUpperCase() + " - Please indicate the number of people in your party.";
                status = "bad";
            }
            break;

    }
    //msgBox(elementID);
    
    if (status == "bad") {
        msgBox(msg, status);
        
    } else {
        if (elementID == "hotelList" || elementID == "party") {
            calcBooking(elementID);
        }
    }
    
    // remove highlight
    if (element.classList.contains("highlight")) {
        element.classList.remove("highlight");
    }
};

function calcBooking(elementID) {
    // grab elements
    var bookingsTab  = document.getElementById("booking"),
        bookingsList = document.getElementById("bookingList"),
        elObject     = document.getElementById(elementID),
        listItem     = document.createElement("LI"),
        textNodes = new Array(), tmp, tmpNode, i;
    
    // show bookings if hidden
    if (bookingsTab.classList.contains("hidden")) {
         bookingsTab.classList.remove("hidden");
    }
    
    switch (elementID) {
        case "hotelList":
            
            tmp = "Hotel: " + elObject.value;
            tmpNode = document.createTextNode(tmp);
            
            alert("value: " + tmpNode.value);
            
            textNodes.push(tmpNode);
            
            break;
            
        case "party":
            tmp = "Participants: " + elObject.value;
            
            // DEBUG: calc the booking quote
            alert("value: " + tmp);
            
            tmpNode = document.createTextNode(tmp);
            textNodes.push(tmpNode);
            
            break;
    }
    
    /*
    can't put nodes into an array
    so, will have to fill an object
    then use the object to update the HTML
    for (i in textNodes) {
        listItem.appendChild(i);
    }
    */
    listItem.appendChild(tmpNode);
    
    bookingsList.appendChild(listItem);
}

function highlightElement(elementID) {
    var element = document.getElementById(elementID);
    element.classList.add("highlight");
}