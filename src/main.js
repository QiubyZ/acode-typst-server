import plugin from "../plugin.json";

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
	setUpFileIcon() {
		this.#style = (
			<style
				textContent={`.file_type_typ::before{
          display: inline-block;
          content: '';
          background-image: url(${this.baseUrl}/typst.png);
          background-size: contain;
          background-repeat: no-repeat;
          height: 1em;
          width: 1em;
        }`}
			></style>
		);
		document.head.append(this.#style);
	}
	async #setup(acodeLanguageClient) {
		require("./code_mode.js");
		this.setUpFileIcon();
		addMode("typst", ["typ", ".typ"], "Typst");
		this.setupLanguageClient(acodeLanguageClient);
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
	getCompletions(editor, session, pos, prefix, callback) {
		typstClient.connection
			.sendRequest("textDocument/completion", {
				textDocument: { uri: "file:///path/to/file.typ" },
				position: { line: pos.row, character: pos.column },
			})
			.then((response) => {
				// Pastikan response dan response.result.items ada
				if (!response || !response.result || !Array.isArray(response.result.items)) {
					console.error("Invalid completion response:", response);
					callback(null, []); // Kirim daftar kosong jika respons tidak valid
					return;
				}

				// Ekstrak saran dari respons
				const suggestions = response.result.items.map((item) => ({
					caption: item.label,
					value: item.insertText || item.label, // Gunakan insertText jika ada, jika tidak gunakan label
					meta: item.detail || "Typst",
					score: 1,
				}));

				console.log("Suggestions:", suggestions);
				callback(null, suggestions); // Kirim saran ke editor
			})
			.catch((error) => {
				console.error("Error fetching completions:", error);
				callback(null, []); // Kirim daftar kosong jika terjadi error
			});
	}
	setupLanguageClient(acodeLanguageClient) {
		/**
		 * @type {WebSocket} socket
		 */
		let socket = acodeLanguageClient.getSocketForCommand(
			this.settings.serverPath,
			this.arguments,
		);

		// Inisialisasi LanguageClient
		let typstClient = new acodeLanguageClient.LanguageClient({
			type: "socket",
			socket: socket,
		});

		// Registrasi layanan untuk Typst
		acodeLanguageClient.registerService("typst", typstClient);
		acode.registerFormatter(plugin.name, ["typ", "typst"], () => acodeLanguageClient.format());

		// Handler untuk menangkap notifikasi dan request dari server
		// 		let handler = () => {
		// 			// Tangkap respons untuk `textDocument/completion`
		// 			typstClient.connection.onNotification("textDocument/publishDiagnostics", (params) => {
		// 				console.log("Diagnostics:", params);
		// 			});
		// 			typstClient.connection.onRequest((method, params) => {
		// 				console.log(method, params);
		// 			});

		// 			// Tangkap semua respons lainnya
		// 			typstClient.connection.onNotification((method, params) => {
		// 				console.log("Notification Received:", method, params);
		// 			});
		// 		};

		// 		// Tambahkan event listener untuk koneksi WebSocket
		// 		socket.addEventListener("open", () => {
		// 			if (typstClient.isInitialized) {
		// 				handler();
		// 			} else {
		// 				typstClient.requestsQueue.push(() => handler());
		// 			}

		// 			console.log("CONNECTION OPENED");
		// 		});
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
