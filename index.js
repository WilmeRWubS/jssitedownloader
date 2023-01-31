addEventListener("fetch", event => {
    const url = new URL(event.request.url);
    if (url.pathname === '/download') {
        event.respondWith(handleDownloadRequest(event.request));
    } else {
        event.respondWith(handleRequest(event.request))
    }
});

async function handleDownloadRequest(request) {
    try {
        // Parse the URL for any necessary parameters
        const url = new URL(request.url);
        const encodedLink = url.searchParams.get('encoded_link');

        // Decode the Base64 encoded string to get the actual download link
        const link = atob(encodedLink);

        // Fetch the file from the download link
        const response = await fetch(link)

        // Return the file as the response
        return new Response(response.body, {
            headers: {
                "Content-Type": response.headers.get("Content-Type"),
                "Content-Disposition": `attachment; filename=${link.split("/").pop()}`,
            },
        })
    } catch (error) {
        // Return a custom error message in the response
        return new Response(`Dit bestand klinkt niet legit broer. Probeer nog maar een keer. `, {
            status: 500,
            headers: { "Content-Type": "text/plain" },
        })
    }
}

async function handleRequest(request) {
    // Check if the request is a POST request
    if (request.method === "POST") {
        // Get the link from the request body
        const formData = await request.formData()
        const link = formData.get("link")

        try {
            // Fetch the file from the download link
            const response = await fetch(link)
            // Return the file as the response
            return new Response(response.body, {
                headers: {
                    "Content-Type": response.headers.get("Content-Type"),
                    "Content-Disposition": `attachment; filename=${link.split("/").pop()}`,
                },
            })
        } catch (error) {
            // Return a custom error message in the response
            return new Response(`Dit bestand klinkt niet legit broer. Probeer nog maar een keer. `, {
                status: 500,
                headers: { "Content-Type": "text/plain" },
            })
        }

    } else {
        // Create the HTML for the download form
        const logo = `<svg aria-hidden="true" class="octicon octicon-mark-github" height="32" version="1.1" viewBox="0 0 16 16" width="32"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>`
        const html = `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="icon" href="https://wilmerdrive.nl/0:/serjico.ico" type="image/x-icon">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
                <title>Wilmers Downloader</title>
            </head>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <a class="navbar-brand" href="#">Home</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="https://wilmerdrive.nl">Wilmerdrive</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="https://download.wilmerdrive.nl">Download</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div class="jumbotron vertical-center">
            <div class="container">
            <body>
                <h1>Wilmers Downloader</h1>
                <form method="POST">
                    <label for="link">Gib link: (should end with filename.extension)</label><br>
                    <input type="text" id="link" name="link"><br>
                    <br>
                    <button type="submit" class="btn btn-dark">Download</button>
                    <button type="button" class="btn btn-dark" onclick="copyLink()">Copy</button>
                    <button type="button" class="btn btn-dark" onclick="encryptLink()">Encrypt</button>
                </form>
            <script>
                function copyLink() {
                    var link = document.getElementById("link").value;
                    var fullLink = "https://download.wilmerdrive.nl/download?link=" + link;
                    navigator.clipboard.writeText(fullLink);
                }
                function encryptLink() {
                    var link = document.getElementById("link").value;
                    var encryptedLink = btoa(link);
                    encryptedLink = "https://download.wilmerdrive.nl/download?encoded_link=" + encryptedLink;
                    navigator.clipboard.writeText(encryptedLink);
                }
            </script>
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
            </body>
            </div>
            </div>
            <footer class="bg-dark py-3 mt-5" style="position: fixed; bottom: 0; width: 100%; height: 60px;">
            <div class="container">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto text-white">
                        <a href="https://github.com/WilmeRWubS/jssitedownloader">${logo}</a>
                        <span class="mx-2">|</span>
                        <p class="d-inline-block m-0">Copyright &copy; 2023 Whocares</p>
                    </div>
                </div>
            </div>
            </footer>
            </html>
        `;

        // Return the HTML as the response
        return new Response(html, {
            headers: { "Content-Type": "text/html" },
        })
    }
}
