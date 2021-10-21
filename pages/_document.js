import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <div id="notifications"></div>
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCachaOSU1TcoO7gLf0BWORvybeSrueacE&libraries=places"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
