/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => PasteLinkPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/utils/is-cursor-in-link.ts
var isCursorInLink = (cursor, line) => {
  const regex = /\[(.*?)\]\((.*?)\)/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    if (cursor.ch > match.index && cursor.ch < regex.lastIndex) {
      return true;
    }
  }
  return false;
};
var is_cursor_in_link_default = isCursorInLink;

// src/utils/is-url.ts
var isUrl = (str) => {
  if (str.includes("\n"))
    return false;
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
};
var is_url_default = isUrl;

// src/utils/make-link.ts
var makeLink = (title, content) => {
  var _a, _b;
  const regex = /\[(.*?)\]\((.*?)\)/;
  if (regex.test(title)) {
    title = (_b = (_a = title.match(/\[(.*?)\]/)) == null ? void 0 : _a[1]) != null ? _b : "";
  }
  if (/\s/g.test(content) && !/^<.*?>$/g.test(content)) {
    content = `<${content}>`;
  }
  return `[${title}](${content})`;
};
var make_link_default = makeLink;

// src/main.ts
var DEFAULT_SETTINGS = {
  overridePasteHandler: true
};
var PasteLinkPlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.isShiftDown = false;
  }
  onKeyDown(e) {
    if (e.key === "Shift")
      this.isShiftDown = true;
  }
  onKeyUp(e) {
    if (e.key === "Shift")
      this.isShiftDown = false;
  }
  insertIntoSelection(editor, content) {
    const selection = editor.getSelection();
    const link = make_link_default(selection, content);
    editor.replaceSelection(link);
    if (link.startsWith("[]")) {
      const cursor = editor.getCursor();
      cursor.ch -= link.length - 1;
      editor.setCursor(cursor);
    }
  }
  onPaste(e, editor) {
    var _a, _b;
    if (e.defaultPrevented)
      return;
    if (this.isShiftDown)
      return;
    const clipboardContent = (_b = (_a = e.clipboardData) == null ? void 0 : _a.getData("text/plain")) != null ? _b : "";
    if (!is_url_default(clipboardContent))
      return;
    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);
    if (is_cursor_in_link_default(cursor, line))
      return;
    e.preventDefault();
    this.insertIntoSelection(editor, clipboardContent);
  }
  async onCommand(editor) {
    const content = await navigator.clipboard.readText();
    if (!is_url_default(content)) {
      this.app.commands.executeCommandById("editor:insert-link");
      return;
    }
    this.insertIntoSelection(editor, content);
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SettingTab(this.app, this));
    if (this.settings.overridePasteHandler) {
      this.registerDomEvent(document, "keyup", this.onKeyUp.bind(this));
      this.registerDomEvent(
        document,
        "keydown",
        this.onKeyDown.bind(this)
      );
      this.registerEvent(
        this.app.workspace.on("editor-paste", this.onPaste.bind(this))
      );
    }
    this.addCommand({
      id: "paste-link",
      name: "Paste Markdown link",
      editorCallback: this.onCommand.bind(this)
    });
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var SettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Override paste handler").setDesc(
      "Overrides Obsidian's default paste handler so that links are automatically inserted on system paste"
    ).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.overridePasteHandler).onChange(async (value) => {
        this.plugin.settings.overridePasteHandler = value;
        await this.plugin.saveSettings();
        new import_obsidian.Notice(
          "Paste handler settings changed. Restart Obsidian."
        );
      })
    );
  }
};
