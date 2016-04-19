<html>
    <head>
      <title>Welcome!</title>
    </head>
    <body>
      <h1>${greeting}</h1>
      <p>Enjoy using puerF, it does work for you ;)</p>
      <p>Try the links below for some examples of mocked routes.</p>
      <#list routes as route>
        <a href="${route}">${route}</a><br/>
      </#list>
    </body>
</html>
