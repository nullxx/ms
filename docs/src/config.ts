export const SITE = {
  title: "Documentación",
  description: "MS simulator docs.",
  defaultLanguage: "es_ES",
};

export const KNOWN_LANGUAGES = {
  Spanish: "es",
};

// Uncomment this to add an "Edit this page" button to every page of documentation.
export const GITHUB_EDIT_URL = `https://github.com/nullxx/ms/tree/master/docs/`;

// Uncomment this to enable site search.
// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: "ms-nullx",
  appId: "TNNQ123F7B",
  apiKey: "9d92ff47c36761a27f657d3d420612dc",
};

export const SIDEBAR = {
  es: [
    { text: "", header: true },
    { text: "Introducción", link: "es/introduction" },
    { text: "Sobre simulador MS", header: true },
    { text: "Arquitectura del simulador", link: "es/architecture" },

    { text: "Sobre la MS", header: true },
    { text: "Descripción", link: "es/description" },

    { text: "COMPONENTES", header: true },
    { text: "Visión general", link: "es/components" },
    { text: "Contador de programa (PC)", link: "es/components/PC" },
    { text: "Memoria", link: "es/components/MEMORY" },
    { text: "Unidad de control", link: "es/components/CU" },
    { text: "Depurador", link: "es/components/debugger" },

    { text: "PROGRAMACIÓN", header: true },
    { text: "Sintaxis", link: "es/instructions/syntax" },
    { text: "Instrucciones soportadas", link: "es/instructions/instructions" },
    { text: "MOV", link: "es/instructions/MOV" },
    { text: "ADD", link: "es/instructions/ADD" },
    { text: "CMP", link: "es/instructions/CMP" },
    { text: "BEQ", link: "es/instructions/BEQ" },

    // { text: "Ejemplos", header: true },
    // { text: "Multiplicación", link: "es/examples/multiplication" },
    // { text: "Factorial", link: "es/examples/factorial" },
    // { text: "Función maliciosa", link: "es/examples/malicious-function" },

  ],
};
