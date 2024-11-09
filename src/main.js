
import "./mode-typst"
import plugin from "../plugin.json";
const Url = acode.require('url');
let AppSettings = acode.require("settings");

const { addMode, removeMode } = acode.require("aceModes");
class AcodePlugin {
  #style;
  async init() {
    let acodeLanguageClient = acode.require("acode-language-client");
    
    if (acodeLanguageClient) {
      await this.#setup(acodeLanguageClient);
    } else {
      window.addEventListener("plugin.install", ({ detail }) => {
        if (detail.name === "acode-language-client") {
          acodeLanguageClient = acode.require("acode-language-client");
          this.#setup(acodeLanguageClient);
        }
      });
    }
    
  }
  async #setup(acodeLanguageClient) {
    try {
      this.#style = <style
        textContent={
          `.file_type_typst::before{
          display: inline-block;
          content: '';
          background-image: url(${plugin.icon});
          background-size: contain;
          background-repeat: no-repeat;
          height: 1em;
          width: 1em;
        }`
        }
      ></style>

      addMode("typst", ["typ", ".typ"], "Typst");
      document.head.append(this.#style);

      editorManager.files.forEach(file => {
        // update session mode
        if (Url.extname(file.name) === '.typ') {
          file.session.setMode('ace/mode/typst');
        }
      });
      this.setupLanguageClient(acodeLanguageClient);
      
    } catch (error) {
      acode.alert(`Error ${plugin.id}`, error, () => { });
    }
  }

  get settings() {
    // UPDATE SETTING SAAT RESTART ACODE
    if (!window.acode) return this.defaultSettings;
    let value = AppSettings.value[plugin.id];
    if (!value) {
      //Menjadikan Method defaultSettings sebagai nilai Default
      value = AppSettings.value[plugin.id] = this.defaultSettings;
      AppSettings.update();
    }
    return value;
  }
  get settingsMenuLayout() {
    return {
      list: [
        {
          index: 0,
          key: "serverPath",
          promptType: "text",
          prompt: "Change the serverPath before running.",
          text: "Typst-lsp Executable File Path",
          value: this.settings.serverPath,
        },
        {
          index: 1,
          key: "arguments",
          promptType: "text",
          info: "For multiple arguments, please use comma ','\r\nExample: --stdio, -v, -vv",
          prompt: "Argument Of Language Server typst-lsp",
          text: "Typst-lsp Argument",
          value: this.settings.arguments.join(", "),
        },
      ],

      cb: (key, value) => {
        switch (key) {
          case "arguments":
               value = value ? value.split(",").map((item) => item.trim()) : [];
            break;
        }
        AppSettings.value[plugin.id][key] = value;
        AppSettings.update();
      },
    };
  }

  get defaultSettings() {
    return {
      serverPath: "typst-lsp",
      arguments: [],
    };
  }



  setupLanguageClient(acodeLanguageClient) {
    
    // let typstClientsocket = acodeLanguageClient.getSocketForCommand(
    //   "/data/data/com.termux/files/usr/bin/typst-lsp",
    //   [],
    //   //this.settings.serverPath,
    //   //this.settings.arguments,
    // );
    let typstClientsocket = acodeLanguageClient.getSocket("auto/typst-lsp?args=[]");
     let typstClient = new acodeLanguageClient.LanguageClient({
       type: "socket",
       socket:typstClientsocket,
    });
    
    
    acodeLanguageClient.registerService("typst", typstClient);
    acode.registerFormatter(plugin.name, ["typ", "typst"], () =>
      acodeLanguageClient.format(),
    );
  }

  async destroy() {
    if (AppSettings.value[plugin.id]) {
      delete AppSettings.value[plugin.id];
      AppSettings.update();
    }
    this.#style.remove();
    removeMode("typst");
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();

  acode.setPluginInit();
  acode.setPluginInit(
    plugin.id,
    async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
      }
      acodePlugin.baseUrl = baseUrl;
      await acodePlugin.init($page, cacheFile, cacheFileUrl);
    },
    acodePlugin.settingsMenuLayout,
  );

  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
