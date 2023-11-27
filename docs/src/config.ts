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
  indexName: "ms",
  appId: "4XDPZIOFPF",
  apiKey: "e8db70aaba31745b2946a0ad7f32f6cf",
};

export const SIDEBAR = {
  es: [
    { text: "", header: true },
    { text: "Sobre ms", header: true },
    { text: "Introducción", link: "es/introduction" },
    { text: "Arquitectura", link: "es/architecture" },
    { text: "Detalles", link: "es/about" },

    { text: "COMPONENTES", header: true },
    { text: "Visión general", link: "es/components" },
    { text: "Contador de programa (PC)", link: "es/components/PC" },
    { text: "Memoria", link: "es/components/MEMORY" },
    { text: "Unidad de control", link: "es/components/CU" },
    { text: "Depurador", link: "es/components/debugger" },

    { text: "PROGRAMACIÓN", header: true },
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
