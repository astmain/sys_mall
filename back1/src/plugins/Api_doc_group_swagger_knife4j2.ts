//
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { knife4jSetup } from 'nest-knife4j'
import { NestFactory } from '@nestjs/core'

export async function Api_doc_group_swagger_knife4j2(app: any, list_module: any[]) {
  const list_docs: Array<{ name: string; url: string; swaggerVersion: string; location: string }> = []
  for (const item of list_module) {
    // console.log(`111---item:`, item)
    const doc_config = new DocumentBuilder()
      .setTitle(item.title)
      .setDescription(item.description)
      .setVersion('0.1')
      .addGlobalParameters({
        name: 'token',
        in: 'header',
        description: 'token',
        required: true,
        schema: {
          type: 'string',
          default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJ1c2VyX2lkIjoxLCJyb2xlSWRzIjpbXSwiZGVwYXJ0bWVudCI6W3siaWQiOjJ9XSwiaWF0IjoxNzU3NDMyNDgxLCJleHAiOjI2MjEzNDYwODEsInJvbGVzIjpbXSwiZXh0cmEiOnsiY2hlY2tlZCI6dHJ1ZX19.dHfLiPbWiLKdu5NYvNPcXTnVWvaSq3XQsIzyj-v6bJ0',
          // default: '',
        },
      })

      .build()
    const document = SwaggerModule.createDocument(app, doc_config, { include: item.imports })

    SwaggerModule.setup(item.title, app, document)
    list_docs.push({
      name: item.title,
      url: `/${item.title}-json`,
      swaggerVersion: '0',
      location: ``,
    })
    // console.log(`111---list_docs:`, list_docs)
    await knife4jSetup(app, list_docs)
    // console.log(`111---document:`, document)

    // console.log(Object.keys(document.paths)) // 所有路由 path

    // parse_swagger_document(document)
    import('fs').then(fs => {
      fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
    });
  }
}



function parse_swagger_document(document: any) {
  const components = document?.components?.schemas
  console.log(`999---components:`, components)
  if (document?.info?.title === 'v1') {
    console.log(`111---document:`, document)
    for (const path of Object.keys(document.paths)) {
      if (!path.includes('login')) return
      console.log(`222---path:`, path)
      const [method] = Object.keys(document.paths[path])
      console.log(`333---method:`, method)
      const summary = document.paths[path][method].summary
      console.log(`444---summary:`, summary)
      document.paths[path]
      console.log(`555---document.paths[path]:`, JSON.parse(JSON.stringify(document.paths[path])))
      console.log(`666---parameters`, JSON.parse(JSON.stringify(document.paths[path])).post.parameters)
      console.log(`777---requestBody`, JSON.parse(JSON.stringify(document.paths[path])).post.requestBody)
      console.log(`888---requestBody`, JSON.parse(JSON.stringify(document.paths[path])).post.requestBody['content']['application/json'].schema)
      console.log(`999---components`,JSON.stringify(components,null,2))
    } // 所有路由 path
  }
}