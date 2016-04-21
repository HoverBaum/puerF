<a name="module_puer-freemarker"></a>

## puer-freemarker
puerF, a simple tool to run a live reloading server
    with mocked routes and FreeMarker templates.


* [puer-freemarker](#module_puer-freemarker)
    * [.init(options, callback)](#module_puer-freemarker.init)
    * [.start(options, callback)](#module_puer-freemarker.start)
    * [.close(callback)](#module_puer-freemarker.close)

<a name="module_puer-freemarker.init"></a>

### puer-freemarker.init(options, callback)
Runs the initializer. Will output basic files to the current working directory.

**Kind**: static method of <code>[puer-freemarker](#module_puer-freemarker)</code>  
**See**: initializer  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | Options for the initializer. |
| [options.onlyConfig] | <code>boolean</code> | <code>false</code> | Only create the config file. |
| callback | <code>function</code> |  | Function to call once done. |

<a name="module_puer-freemarker.start"></a>

### puer-freemarker.start(options, callback)
Starts the core application.

**Kind**: static method of <code>[puer-freemarker](#module_puer-freemarker)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  | An object containing options. |
| [options.routes] | <code>array</code> | <code>[&#x27;mock/ftlRoutes.js&#x27;, &#x27;mock/routes.js&#x27;]</code> | An array of paths to all files containing mocked routes. |
| [options.config] | <code>boolean</code> | <code>false</code> | Use config file. |
| [options.templates] | <code>string</code> | <code>&quot;&#x27;templates&#x27;&quot;</code> | Root folder for FTL template files. |
| [options.root] | <code>string</code> | <code>&quot;&#x27;./&#x27;&quot;</code> | Root folder for static files to serve. |
| [options.port] | <code>number</code> | <code>8080</code> | The port to use for the server. |
| [options.watch] | <code>string</code> | <code>&quot;&#x27;js&amp;#124;css&amp;#124;html&amp;#124;xhtml&amp;#124;ftl&#x27;&quot;</code> | Filetypes to watch for changes. |
| [options.exclude] | <code>regEx</code> | <code>/node_modules/</code> | Files to exclude from watching. |
| [options.localhost] | <code>boolean</code> | <code>false</code> | Use `localhost` instead of `127.0.0.1`. |
| [options.browser] | <code>boolean</code> | <code>true</code> | Automatically open a browser for the user. |
| [options.debug] | <code>boolean</code> | <code>false</code> | Enable debugging output and log file. |
| callback | <code>function</code> |  | Function to call once started. |

<a name="module_puer-freemarker.close"></a>

### puer-freemarker.close(callback)
Programatically closes puerF.

**Kind**: static method of <code>[puer-freemarker](#module_puer-freemarker)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Function to call once done. |

