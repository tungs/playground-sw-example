# Service Worker Web Playground Example

This example shows a basic implementation of serving arbitrary data to an iframe to use as resources. This example requires a web server and a recent version of Firefox (at least v44) or Chrome (at least v40).

To view this example in action, you need to host files, and then view them in browser. For example, using Linux/MacOS, navigate to the directory and run
```
python3 -m http.server 8000
```

Then using Firefox or Chrome, navigate to http://127.0.0.1:8000/playground.html. Usually service workers require being served over `https`, but there's an exception for 127.0.0.1 for development purposes.

In this example, there are two generated files, `index.html` and `script.js`, that are sent to the service worker to use as resources for the iframe in `playground.html`. They exist only in browser; the server is unaware of their existence. After you load http://127.0.0.1:8000/playground.html, you can navigate to http://127.0.0.1:8000/playground/index.html to view the generated file.

This technique is particularly useful for web playgrounds, to rapidly show the results of edited code. It takes a shorter network path compared to approaches that upload code and download them to an iframe, and offers a cleaner way of serving files, compared to approaches that alter code of a web document.
