# Item Card

Fantasy Item Card HTML Generator

## Generating Item Cards
To generate item cards, execute the command:

> node itemcard [ layout=default ]

You can specify the layout type for a custom layout, or else it will use the default layout specified in 'config.json'.

When the process completes, will generate minified HTML files for each item data file it finds in the output directory (also specified in 'config.json').

### Configuration

To specify a custom directory, whether for input or output, edit 'config.json' and change the respective paths:

- 'itemdir': The directory to look for item files
- 'modelfile': The base html filepath
- 'modeljs': The base js directory
- 'modelcss': The base css directory
- 'resources': The directory to look for resources (i.e. tables, specials, etc.)
- 'artifacts': The directory to output item cards
- 'defaultlayout': The default layout type

## Adding Items
All items are specified by JSON files in the item directory (as specified in 'config.json'). For example:

```
{
  "name": "Mystery Item",
  "desc": "You have found a <a class=\"mystery\">mysterious</a> item, and you are not sure what it does.",
  "stat": "+5 To Hit, 1d12+2 DMG",
  "acts": "It will do <a class=\"metal\">something</a>, but you are not sure what. It may heal <a class=\"stat\">1d4 HP</a> or deal <a class=\"stat\">1d11 Psychic DMG</a>. It probably belongs to <a class=\"holy\">Tiamat</a>.",
  "special.mystery": false,
  "special.holy": false,
  "special.metal": false,
  "portrait": "$table.portrait",
  "table.portrait": 0
}
```

Each property is designated in the layout file as prefixed by '$' followed by the name (i.e. '$name' refers to the name property).

### Tables

Each property can also reference tables as designated by the prefix 'table', which takes an index. This will load the respective JSON file in the resource directory under 'tables', and lookup the value for the index. The type of table file is specified after the prefix. For example, 'table.portrait' will look for the table: 'portrait.json'.

### Specials

For more complex properties, use the prefix 'special' and create the corresponding javascript file in the resource directory, under 'specials'. This is a way to do more special formatting, as it will be called with every line.

### Layouts

To make different looking item cards, try making different layouts. The layout is specified on execute as an argument. Refer to 'default.html' for more information.
