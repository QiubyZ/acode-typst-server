# Typst Language Server (typst-lsp)

For Language Server Typst (Beta)

**Please Support Me** 🥺

<a href="https://trakteer.id/qiubyzhukhi/tip" target="_blank"><img id="wse-buttons-preview" src="https://cdn.trakteer.id/images/embed/trbtn-red-1.png?date=18-11-2023" height="40" style="border:0px;height:40px;" alt="Trakteer Saya"></a>

# Acode Plugin Requiriment Installed

1. [Acode Language Client (MOD)](https://acode.app/plugin/acode.language.client.mod) and Uninstall [Acode Language Client](https://acode.app/plugin/acode.language.client) If you use this MODIFICATION.
2. Follow the instructions there to run the Language Server.
3. you can watch my video to install _Acode Language Client_ [Click Here](https://youtu.be/Rc-jvCWHG9E?si=VuY0VCMD2jnn3ptE)

## Setup Typst

Installing typst on Termux

```bash
pkg in typst typst-lsp typstfmt
```

## Code Runner Config

```json
{
  "extension": "typ",
  "name": "Typst",
  "command": "typst compile $dir$name $dir$nameNoExt.png"
},

```

, for more you can see the repository from [TYPST](https://github.com/typst/typst?tab=readme-ov-file#usage)
