/*
Here is going to be all the helper functions that will be used in the game that are generic 
enough to be in the global space. The shortcut sprite function and a more general testing 
function for variables because I don't want to keep doing try and catch blocks for everything.

CB: 12-23-17: 
CB:  7-30-17: Initial Version.
*/

/*
@param v variable = The variable we are testing.
@param type str = The string we are going to use for the type check.
@param less_than int = optional
@param greater_than int = optional
@param error_str str = The error string to output to the console.
*/
function testVarValidity(v, type, less_than, greater_than, error_str)
{
    var funct_error_str = "ERROR::testVarValidity:";
    // Test we actually got the correct types of stuff.
    try {
        if (typeof(type) != "string") throw " type is not a string? " + type;
    }
    catch(err)
    {   console.error(funct_error_str + err); 
        return false;
    }

    try {
        if (typeof(less_than) != "number") throw " less_than is not a number? " + less_than;
    }
    catch(err)
    {   console.error(funct_error_str + err); 
        return false;
    }

    try {
        if (typeof(greater_than) != "number") throw " greater_than is not a number? " + greater_than;
    }
    catch(err)
    {   console.error(funct_error_str + err); 
        return false;
    }

    try {
        if (typeof(error_str) != "string") throw " error_str is not a string? " + error_str;
    }
    catch(err)
    {   console.error(funct_error_str + err); 
        return false;
    }

    // Okay if we get here we can now begin testing the variable
    if (type == "number")
    {
        // Tests: type, <, >
        try{
            if (typeof(v) != "number") throw "var is not a number: " + v;
        }
        catch(err)
        {
            console.error(error_str + err);
            return false;
        }

        // Special value to skip test: -123
        if (less_than != -123)
        {
            try{
                if (v < less_than) throw "var: " + v + " is less than the range: " + less_than;
            }
            catch(err)
            {
                console.error(error_str + err);
                return false;
            }
        }

        // Special value to skip test: 123
        if (greater_than != 123)
        {
            try{
                if (v > greater_than) throw "var: " + v + " is greater than the range: " + greater_than;
            }
            catch(err)
            {
                console.error(error_str + err);
                return false;
            }
        }
    }
    else if (type == "string")
    {
        // tests: type
        try {
            if (typeof(v) != "string") throw " var: " + v + " is not a string.";
        }
        catch (err)
        {
            console.error(error_str + err);
            return false;
        }
    }
    else if (type == "boolean")
    {
        try {
            if (typeof(v) != "boolean") throw " var: " + v + " is not a boolean.";
        }
        catch(err)
        {
            console.error(error_str + err);
            return false;
        }
    }
    else
    {
        console.error(funct_error_str + " type if else fall through triggered, shouldn't have happened: " + type);
        return false;
    }
    return true;
}

/*
    Just a helper function that takes in a sprite object and sets the tint
    of the sprite to the selected color.
    @param sprite obj = The sprite object
    @param color str = The color in string form to set the tint of the sprite to.
*/
function setSpriteTint(sprite, color)
{
    try {
        if (typeof(color) != "string") throw "ERROR::setSpriteTint is not string: " + color;
    }
    catch(err)
    {   console.error("In world.js file: " + err);
        return;
    }

    var upper_color = color.toUpperCase();

    if (upper_color == "RED")
    {
        sprite.tint = 0xff0000;
    }
    else if (upper_color == "BLUE")
    {
        sprite.tint = 0x0000ff;
    }
    else if (upper_color == "GREEN")
    {
        sprite.tint = 0x00ff00;
    }
    else if (upper_color == "YELLOW")
    {
        sprite.tint = 0xffff00;
    }
    else if (upper_color == "PURPLE")
    {
        sprite.tint = 0xff00ff;
    }
    else if (upper_color == "CYAN")
    {
        sprite.tint = 0x00ffff;
    }
    else if (upper_color == "BLACK")
    {
        sprite.tint = 0x000000;
    }
    else if (upper_color == "WHITE")
    {
        sprite.tint = 0xfffffe;
    }
    else
    {
        console.error("ERROR::setSpriteTint: Unknown color: " + color + ", maybe misspelling.");
    }
}

/*
    This is just a function that has a bunch of functions bundled together to make it 
    easier on me to figure out what is going on and not repeat too many lines of code.
    @param sprite obj = The sprite object.
    @param tint str = The color to set the sprite.
    @param width int = The width of the sprite.
    @param height int = The height of the sprite.
*/
function setSpriteTintAndSize(sprite, tint, width, height)
{
    if (sprite == null) 
    { 
        console.error("Error::setSpriteTintAndSize sprite was null, WTF!");
        return; 
    }

    try {
        if (typeof(tint) != "string") throw " tint is not a string: " + tint;
    }
    catch(err)
    {
        console.error("ERROR::setSpriteTintAndSize: " + err);
    }

    try {
        if (typeof(width) != "number" || typeof(height) != "number") throw "width or height not a #.";
    }
    catch(err)
    {
        console.error("ERROR::setSpriteTintAndSize: " + err);
        return;
    }

    setSpriteTint(sprite, tint);
    sprite.width = width;
    sprite.height = height;
}
