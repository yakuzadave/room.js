jsmoo (tentative title)
=======================

A [MOO](http://en.wikipedia.org/wiki/MOO) written in coffeescript running on node.js.

MOO stands for Mud, Object Oriented. One of the original MOOs was [LambdaMoo](http://en.wikipedia.org/wiki/LambdaMOO), developed at Xerox PARC.

The basic idea is to have a MUD which (privelaged) players can extend while in game.  You can create and edit objects, locations, and code from inside the MOO.

jsmoo is different from other MOOs because:

1. It uses [CoffeeScript](http://coffeescript.org/) as the programming language instead of the original MOO language or some other custom language.
2. You connect using a web browser, not a telnet or mud client.
3. You can edit the game code in the browser, using a fairly decent in-browser code editor ([Ace](http://ace.ajax.org/)).

Running the Server
------------------

Assuming you have a working node.js environment: clone this repo, npm install, copy the example db, and launch the server:

    git clone git@github.com:doughsay/jsmoo.git
    cd jsmoo
    npm install
    cp db.example.json db.json
    ./server.coffee

Connect to it using a web browser by going to [http://localhost:8888/](http://localhost:8888/).

The provided example db has one user who is also a programmer: username=root, password=p@ssw0rd.

The only currently implemented verbs are:

* look
* say [anything]
* examine [object]
* get [object]
* drop [object]
* swing sword

Programming
-----------

If you are signed in as a programmer, you can evaluate any CoffeeScript code by using the *eval* command (; shorthand).

    eval 2 + 2
    -> 4

    ;Math.pow 2, 4
    -> 16

Eval Context
------------

The eval context contains these global variables:

* `$player` - the object representing you, the player.
* `$here` - the object representing your current location.

You also have access to some global functions:

### `$(id)`

Retrieve the object with the given `id`.

### `list`

Returns a list all objects in the database with their `id`, `name` and `var` fields.

### `search(str)`

Returns a list of all objects whos name matches `str` in the database.

### `tree(id = undefined)`

Returns the object inheritance tree.

* `id` - (int) (optional) Use object `id` as the root.

### `locations(id = undefined)`

Return a tree representing objects' locations.  Top level objects in this tree are 'nowhere', and inner nodes are contained within their parents.

* `id` - (int) (optional) Only show object `id` and it's contents.

### `ls(x, depth = 2)`

Pretty print `x` to a depth of `depth`.

### `edit(object, verb)`

Load the verb named `verb` of `object` into the verb editor.

### `addverb(object, verb, dobjarg = 'none', preparg = 'none', iobjarg = 'none')`

Add a new verb to `object` called `verb` and load it into the verb editor.  You can optionally specify the argument specifiers as well.

### `rmverb(object, verb)`

Remove verb named `verb` from `object`.

Objects
-------

You can find objects in two ways.  The above $() method will retrieve objects if you know their `id`.  Some objects have gobal names associated with them.  To access these objects (e.g. object 1, the root object) just type it's global name after a $:

    $root

Object attributes
-----------------

You can access attributes on objects like this:

    $thing.name

### `id`

(Int) {read-only} The objects unique id.

### `parent`

(Object) The parent of this object.  This object inherits verb and properties from it's parent, but it can be null.

### `name`

(String) The object's name.

### `aliases`

(Array[String]) Aliases that you can use to refer to this object.

### `location`

(Object) Where the object is located, if anywhere.

### `contents`

(Array[Object]) {read-only} An array of objects that are contained within this object.

### `player`

(Boolean) {read-only} Is this object a player?

### `programmer`

(Boolean) {read-only} Is this object a programmer?

### `properties`

(Array[Any]) {read-only} The object's custom properties.

### `verbs`

(Array[Verb]) {read-only} The object's verbs.

Object methods
--------------

Calling methods on objects is simple:

    $player.addProp(arg1, arg2)

These methods are available on moo objects:

### `addProp(key, value)`

Adds a new property to this object.

* `key` - (string) The key to store the property under.  If it already exists it will be overwritten.
* `value` - (any) The value to store.  Can be any type.

### `rmProp(key)`

Removes a property from an object.

* `key` - (string) The key to remove.

### `getProp(key)`

Retrieve the value of a property.

* `key` - (string) The key to retrieve.

### `setProp(key, value)`

Same as `setProp`.

* `key` - (string) The key to store the property under.  If it already exists it will be overwritten.
* `value` - (any) The value to store.  Can be any type.

### `clone(newName, newAliases = [])`

Creates a clone of this object, copying all its properties and verbs.

* `newName` - (string) The name of the new object.
* `newAliases` - (array[string]) (optional) The list of aliases for the new object.

### `create(newName, newAliases = [])`

Creates a child of this object.  The child inherits all of its properties and verbs.

* `newName` - (string) The name of the new object.
* `newAliases` - (array[string]) (optional) The list of aliases for the new object.

Verbs
-----

To edit verbs on objects, use the functions `addverb`, `edit` and `rmverb` described above.

    edit $thing, 'examine'

This will load the verb 'examine' of the 'Thing Class' into the verb editor.

The verb context has different variables available to it.  They are as follows:

* `$this` - the object the verb was called on
* `$player` - the player who called the verb
* `$here` - the player's location
* `$dobj` - the direct object, if any, that was specified when calling the verb
* `$iobj` - the indirect object, if any, that was specified when calling the verb
* `$verb` - the verb's name
* `$argstr` - the entire string that was specfied not including the verb's name
* `$dobjstr` - the direct object string
* `$prepstr` - the preposition string
* `$iobjstr` - the indirect object string

The verb context also has access to the `$` global function, and any global object names.

TODO
----

### Moo functionality

* Better object matching (See first big comment in lib/moo.coffee)
* Better verb matching (See second big comment in lib/moo.coffee)
* Using 'this' as the direct/indirect object argument specifier for verbs doesn't work yet
* Preposition argument specifiers need some work.  Some prepositions are synonymous, e.g. 'with' and 'using' should be interchangable.  "open door with key" / "open door using key"
* There should be a fallback function to catch un-recognized commands, like the 'huh' verb in LambdaMoo.
* Logout
* Remove database assumptions from the server code (player creation)