function scrap() {
  const auth = login();

  const funcionarios = [];

  for (const centro of centros) {
    for (const nucleo of centro.nucleos) {
      console.log(`Buscando SEDUC-${nucleo.sigla}/ITS...`);
      const res = UrlFetchApp.fetch(
        `https://www.documentos.spsempapel.sp.gov.br/siga/app/lotacao/exibir?sigla=SEDUC-${nucleo.sigla}/ITS`,
        {
          method: 'get',
          headers: {
            cookie: auth,
          },
        },
      );

      funcionarios.push([
        {
          ...nucleo,
          bandingColor: centro.bandingColor,
          tabColor: centro.tabColor,
        },
        res
          .getContentText()
          .match(/span  title="(.+)+/g)
          .map((f) =>
            f
              .replace(/span\s+title=|">?/g, '')
              .split('-')
              .map((s) => s.trim())
              .filter((f) => f.length),
          )
          .filter((f) => f.length),
      ]);
    }
  }

  return funcionarios;
}

const centros = [
  {
    nucleos: [
      { nome: 'Assistência Técnica', sigla: 'AT' },
      { nome: 'Núcleo de Apoio Administrativo', sigla: 'NA' },
    ],
    tabColor: '#bdbdbd',
    bandingColor: SpreadsheetApp.BandingTheme.LIGHT_GREY,
  },
  {
    nucleos: [
      { nome: 'Centro de Recursos Humanos', sigla: 'CRH' },
      { nome: 'Núcleo de Administração Pessoal', sigla: 'NAP' },
      { nome: 'Núcleo de Frequência e Pagamento', sigla: 'NFP' },
    ],
    tabColor: '#4dd0e1',
    bandingColor: SpreadsheetApp.BandingTheme.CYAN,
  },
  {
    nucleos: [
      { nome: 'Centro de Informações Escolares', sigla: 'CIE' },
      { nome: 'Núcleo de Gestão de Rede Escolar e Matrícula ', sigla: 'NRM' },
      { nome: 'Núcleo de Vida Escolar', sigla: 'NVE' },
      { nome: 'Núcleo de Informações Educacionais e Tecnologia', sigla: 'NIT' },
    ],
    tabColor: '#63d297',
    bandingColor: SpreadsheetApp.BandingTheme.GREEN,
  },
  {
    nucleos: [
      {
        nome: 'Centro de Administração de Finanças e Infraestrutura',
        sigla: 'CAF',
      },
      { nome: 'Núcleo de Administração', sigla: 'NAD' },
      { nome: 'Protocolo', sigla: 'PROT' },
      { nome: 'Núcleo de Compras e Serviços', sigla: 'NCS' },
      { nome: 'Núcleo de Finanças', sigla: 'NFI' },
      { nome: 'Núcleo de Obras e Manutenção Escolar', sigla: 'NOM' },
    ],
    tabColor: '#f7cb4d',
    bandingColor: SpreadsheetApp.BandingTheme.YELLOW,
  },
  {
    nucleos: [
      { nome: 'Supervisão de Ensino', sigla: 'ESE' },
      { nome: 'Núcleo Pedagógico', sigla: 'NPE' },
    ],
    tabColor: '#5b95f9',
    bandingColor: SpreadsheetApp.BandingTheme.BLUE,
  },
];
