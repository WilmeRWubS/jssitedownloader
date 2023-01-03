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
      const link = url.searchParams.get('link');
  
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
      const html = `
        <html>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
        <head>
          <link rel="icon" href="https://wilmerdrive.nl/0:/serj.ico" type="image/x-icon">
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
            <label for="link">Geef link:</label><br>
            <input type="text" id="link" name="link"><br>
            <br>
            <button type="submit" class="btn btn-dark">Download</button>
          </form>
        </body>
        </div>
        </div>
        </html>
      `;
  
      // Return the HTML as the response
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      })
    }
  }
