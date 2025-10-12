'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, User, ChevronRight, HelpCircle } from 'lucide-react';

// Interfaces TypeScript
interface Proposition {
  id: number;
  text: string;
  cluster: string;
  axis: string;
  direction: number;
  explanation: string;
}

interface Leader {
  name: string;
  x: number;
  y: number;
  quadrant: string;
  desc: string;
}

interface Result {
  economic: number;
  social: number;
}

interface Answers {
  [key: number]: number;
}

// Proposições (mantidas as mesmas)
const propositions: Proposition[] = [
  // Cluster 1: Economia, Trabalho e Estado
  { id: 1, text: 'O governo deveria implementar uma renda básica universal, financiada por impostos sobre grandes fortunas e heranças.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: -1, explanation: 'É o pagamento regular de uma quantia fixa em dinheiro a todos os cidadãos, sem contrapartidas ou condicionalidades.' },
  { id: 2, text: 'Empresas estatais em setores estratégicos, como energia e recursos naturais, nunca deveriam ser privatizadas.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: -1, explanation: 'São empresas controladas pelo governo. Privatização é a transferência desse controle para o setor privado.' },
  { id: 3, text: 'A legislação trabalhista deve ser flexibilizada para incentivar a contratação, mesmo que isso signifique menos segurança para o trabalhador.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: +1, explanation: 'Significa reduzir regras e regulamentações sobre contratação, demissão e condições de trabalho.' },
  { id: 4, text: 'O controle de preços de itens essenciais, como alimentos e combustíveis, é uma ferramenta válida para combater a inflação.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: -1, explanation: 'É uma medida governamental que estabelece um valor máximo ou mínimo para a venda de determinados produtos.' },
  { id: 5, text: 'O Estado deve reduzir drasticamente os gastos públicos, mesmo que isso implique cortes em serviços como saúde e educação.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: +1, explanation: 'Implica em o governo diminuir suas despesas em diversas áreas, incluindo serviços públicos.' },
  { id: 6, text: 'A progressividade dos impostos é fundamental: quem ganha mais deve pagar uma porcentagem significativamente maior de impostos.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: -1, explanation: 'É um sistema tributário onde a alíquota (porcentagem) do imposto aumenta à medida que a renda ou o patrimônio da pessoa ou empresa aumenta.' },
  { id: 7, text: 'O mercado financeiro precisa de mais regulação estatal para evitar crises econômicas.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: -1, explanation: 'Consiste na criação de regras e supervisão estatal sobre as atividades de bancos e instituições financeiras.' },
  { id: 8, text: 'O agronegócio deve receber subsídios e incentivos fiscais, dado seu papel central na economia nacional.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: +1, explanation: 'São transferências financeiras ou vantagens fiscais concedidas pelo governo a produtores rurais.' },
  { id: 9, text: 'O principal objetivo da política econômica deve ser o controle da inflação, mesmo que isso cause desemprego no curto prazo.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: +1, explanation: 'Discute a prioridade da política econômica: focar em manter os preços estáveis, mesmo que as medidas para isso possam causar desemprego, ou priorizar o pleno emprego.' },
  { id: 10, text: 'A dívida pública é um obstáculo ao crescimento e sua redução deve ser a prioridade máxima do governo.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: +1, explanation: 'É o valor total que o governo deve a credores internos e externos. A priorização de sua redução geralmente envolve cortes de gastos ou aumento de impostos.' },
  { id: 11, text: 'O sistema de aposentadorias deve ser majoritariamente privado, com o Estado garantindo apenas um benefício mínimo.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: +1, explanation: 'Propõe que a poupança para aposentadoria seja responsabilidade individual, gerida por fundos privados, com participação estatal limitada.' },
  { id: 12, text: 'O livre comércio irrestrito é, em última análise, prejudicial aos trabalhadores e à indústria nacional.', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: -1, explanation: 'Refere-se à eliminação de barreiras comerciais (como tarifas de importação) entre países, permitindo circulação irrestrita de produtos.' },
  { id: 13, text: 'A propriedade privada é um direito absoluto e não deve ser relativizada por conceitos como "função social".', cluster: 'Economia, Trabalho e Estado', axis: 'Econômico', direction: +1, explanation: 'É um princípio legal que estabelece que o uso da propriedade privada deve atender não apenas aos interesses do dono, mas também ao bem-estar da coletividade.' },
  
  // Cluster 2: Tecnologia, Privacidade e Sociedade Digital
  { id: 14, text: 'O desenvolvimento de inteligências artificiais avançadas deve ser estritamente regulado pelo Estado, mesmo que isso atrase a inovação.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Social', direction: +1, explanation: 'Refere-se à criação de leis e limites estatais sobre o desenvolvimento e uso da inteligência artificial.' },
  { id: 15, text: 'As empresas de tecnologia devem ser legalmente responsáveis pelo conteúdo ilegal ou prejudicial publicado em suas plataformas.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Social', direction: +1, explanation: 'Discute se empresas como Facebook e X (Twitter) devem ser legalmente culpadas por conteúdos postados por seus usuários.' },
  { id: 16, text: 'O uso de reconhecimento facial em espaços públicos por agências de segurança deveria ser proibido para proteger a privacidade dos cidadãos.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Social', direction: -1, explanation: 'É o uso de tecnologia para identificar pessoas em locais públicos através de câmeras. O debate é sobre o equilíbrio entre segurança e o direito à privacidade.' },
  { id: 17, text: 'O Estado deveria ter o poder de exigir que empresas de tecnologia forneçam acesso a dados de usuários criptografados em investigações criminais.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Social', direction: +1, explanation: 'Refere-se à discussão sobre se o governo pode obrigar empresas de tecnologia a quebrar a criptografia e entregar dados privados de usuários durante investigações.' },
  { id: 18, text: 'Os cidadãos deveriam ter o direito de processar judicialmente plataformas de mídia social pela remoção de seu conteúdo, se considerarem a moderação injusta.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Social', direction: -1, explanation: 'É o processo pelo qual as redes sociais removem postagens que violam suas regras. A questão é sobre quem tem a palavra final: a plataforma ou o sistema judicial.' },
  { id: 19, text: 'Grandes empresas de tecnologia, como as de busca e redes sociais, deveriam ser divididas para diminuir sua concentração de poder no mercado.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Econômico', direction: -1, explanation: 'Aborda se gigantes da tecnologia (como Google, Amazon) acumularam poder de mercado excessivo, e se deveriam ser divididos em empresas menores.' },
  { id: 20, text: 'A coleta massiva de dados de cidadãos pelo governo é um mal necessário para garantir a segurança nacional.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Social', direction: +1, explanation: 'É a prática de agências estatais de monitorar e armazenar grandes volumes de dados de comunicação dos cidadãos para fins de segurança.' },
  { id: 21, text: 'A neutralidade da rede, que impede provedores de internet de favorecerem ou bloquearem certos tipos de tráfego, deve ser uma lei inegociável.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Econômico', direction: -1, explanation: 'É o princípio de que os provedores de internet devem tratar todo o tráfego de dados igualmente, sem bloquear, diminuir a velocidade ou cobrar mais por conteúdos ou sites específicos.' },
  { id: 22, text: 'O Brasil deveria investir em infraestrutura tecnológica estatal para reduzir sua dependência de empresas estrangeiras.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Econômico', direction: -1, explanation: 'Propõe que o governo invista e controle a infraestrutura digital (como redes de fibra ótica e data centers).' },
  { id: 23, text: 'A educação digital e o combate à desinformação devem ser prioridades financiadas pelo Estado, inclusive com currículos obrigatórios nas escolas.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Social', direction: +1, explanation: 'Refere-se à responsabilidade do Estado em ensinar a população a usar a tecnologia de forma crítica e a identificar notícias falsas (desinformação).' },
  { id: 24, text: 'A automação e a substituição de empregos por IA exigem que o governo crie uma rede de segurança social mais forte para os trabalhadores deslocados.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Econômico', direction: -1, explanation: 'Refere-se à criação ou ampliação de programas estatais de apoio (como seguro-desemprego ou requalificação) para trabalhadores afetados pela automação.' },
  { id: 25, text: 'A liberdade de expressão online deve ser quase absoluta, mesmo que isso permita a disseminação de discursos de ódio ou teorias da conspiração.', cluster: 'Tecnologia, Privacidade e Sociedade Digital', axis: 'Social', direction: -1, explanation: 'Debate se a liberdade de expressão na internet deve ter limites legais ou ser irrestrita.' },

  // Cluster 3: Meio Ambiente, Energia e Sustentabilidade
  { id: 26, text: 'Países desenvolvidos, historicamente os maiores poluidores, deveriam financiar a transição energética de nações em desenvolvimento.', cluster: 'Meio Ambiente, Energia e Sustentabilidade', axis: 'Econômico', direction: -1, explanation: 'É a proposta de que países desenvolvidos transfiram recursos financeiros para países em desenvolvimento para mitigação e adaptação às mudanças climáticas.' },
  { id: 27, text: 'A exploração de recursos naturais em áreas ambientalmente sensíveis é aceitável se for essencial para o crescimento econômico do país.', cluster: 'Meio Ambiente, Energia e Sustentabilidade', axis: 'Econômico', direction: +1, explanation: 'Aborda a tensão entre a exploração de recursos naturais para gerar riqueza e empregos, e a proteção de ecossistemas.' },
  { id: 28, text: 'O governo deve impor metas rígidas de redução de emissões para todas as indústrias, com pesadas multas para quem não cumprir.', cluster: 'Meio Ambiente, Energia e Sustentabilidade', axis: 'Econômico', direction: -1, explanation: 'São obrigações impostas pelo governo para que as indústrias limitem a quantidade de gases de efeito estufa que liberam na atmosfera.' },
  { id: 29, text: 'A transição para fontes de energia renovável deve ser impulsionada pelo mercado e pela iniciativa privada, não por subsídios estatais massivos.', cluster: 'Meio Ambiente, Energia e Sustentabilidade', axis: 'Econômico', direction: +1, explanation: 'Debate se a mudança de combustíveis fósseis para fontes renováveis deve ser liderada pela iniciativa privada ou fortemente incentivada e financiada pelo governo.' },
  { id: 30, text: 'O desmatamento na Amazônia deve ser combatido com tolerância zero, incluindo o uso das forças armadas para fiscalização.', cluster: 'Meio Ambiente, Energia e Sustentabilidade', axis: 'Social', direction: +1, explanation: 'Propõe o emprego de todos os recursos estatais, incluindo forças militares, para eliminar completamente o desmatamento não autorizado.' },
  { id: 31, text: 'A proteção ambiental é um luxo que países em desenvolvimento não podem priorizar em detrimento da erradicação da pobreza.', cluster: 'Meio Ambiente, Energia e Sustentabilidade', axis: 'Econômico', direction: +1, explanation: 'Refere-se ao debate sobre a compatibilidade entre metas de crescimento econômico acelerado e restrições ambientais em países em desenvolvimento.' },
  { id: 32, text: 'A demarcação de terras indígenas e quilombolas é um instrumento crucial para a preservação ambiental.', cluster: 'Meio Ambiente, Energia e Sustentabilidade', axis: 'Social', direction: -1, explanation: 'É o processo oficial pelo qual o governo reconhece e delimita os territórios tradicionalmente ocupados por povos indígenas.' },
  { id: 33, text: 'Um imposto sobre o carbono, que encarece produtos e serviços que emitem gases de efeito estufa, é a forma mais eficiente de combater as mudanças climáticas.', cluster: 'Meio Ambiente, Energia e Sustentabilidade', axis: 'Econômico', direction: -1, explanation: 'É um tributo cobrado sobre a emissão de gases de efeito estufa.' },
  { id: 34, text: 'A energia nuclear é uma alternativa limpa e segura que deve ser expandida para combater o aquecimento global.', cluster: 'Meio Ambiente, Energia e Sustentabilidade', axis: 'Social', direction: +1, explanation: 'É a geração de eletricidade a partir da fissão de átomos. O debate envolve sua baixa emissão de carbono contra os riscos de acidentes e o lixo radioativo.' },
  { id: 35, text: 'As leis ambientais atuais no Brasil são um entrave ao desenvolvimento e precisam ser flexibilizadas.', cluster: 'Meio Ambiente, Energia e Sustentabilidade', axis: 'Econômico', direction: +1, explanation: 'Significa reduzir o rigor das regras de proteção ao meio ambiente aplicadas a projetos de desenvolvimento e atividades econômicas.' },

  // Cluster 4: Direitos, Cultura e Ordem Social
  { id: 36, text: 'O porte de armas por cidadãos comuns deveria ser um direito garantido para a autodefesa.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: -1, explanation: 'Refere-se ao direito de um cidadão comum possuir e carregar armas de fogo para sua própria defesa.' },
  { id: 37, text: 'O aborto deve ser legal e acessível a todas as mulheres, sendo uma questão de saúde pública e autonomia individual.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: -1, explanation: 'Refere-se à proposta de permitir legalmente a interrupção voluntária da gravidez.' },
  { id: 38, text: 'O sistema de cotas raciais em universidades e concursos públicos é uma política de reparação histórica necessária e justa.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: -1, explanation: 'É uma política que reserva uma porcentagem de vagas em universidades ou cargos públicos para pessoas de determinados grupos raciais.' },
  { id: 39, text: 'A pena para crimes hediondos deveria ser mais severa, incluindo a possibilidade de prisão perpétua.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: +1, explanation: 'Propõe aumentar o tempo de prisão ou a severidade das punições para determinadas categorias de crimes.' },
  { id: 40, text: 'O Estado deve garantir a neutralidade de gênero em todos os documentos e formulários oficiais.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: -1, explanation: 'É a proposta de remover ou expandir as opções de gênero além de "masculino" e "feminino" em documentos oficiais.' },
  { id: 41, text: 'A legalização de drogas como a maconha reduziria a violência e deveria ser tratada como uma questão de saúde, não de polícia.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: -1, explanation: 'Refere-se à descriminalização e regulação estatal do comércio e consumo de determinadas substâncias atualmente proibidas.' },
  { id: 42, text: 'A escola deve focar no ensino tradicional, sem abordar temas como identidade de gênero e orientação sexual.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: +1, explanation: 'Debate se o currículo escolar deve incluir conteúdos sobre diversidade sexual e identidades de gênero.' },
  { id: 43, text: 'A imigração é benéfica para o país e as fronteiras deveriam ser mais abertas para refugiados e trabalhadores.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: -1, explanation: 'Refere-se à política de facilitar a entrada e a permanência de imigrantes e refugiados no país.' },
  { id: 44, text: 'A liberdade religiosa permite que instituições de fé se recusem a realizar procedimentos ou cerimônias que vão contra seus dogmas.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: +1, explanation: 'Discute se a crença religiosa de uma pessoa ou instituição lhe dá o direito de se recusar a prestar serviços a outras pessoas, caso isso entre em conflito com sua fé.' },
  { id: 45, text: 'A polícia precisa de mais autonomia e menos supervisão externa para combater o crime de forma eficaz.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: +1, explanation: 'É a ideia de que as forças policiais deveriam ter mais liberdade para agir e tomar decisões sem supervisão de órgãos de controle externos.' },
  { id: 46, text: 'A arte e a cultura que recebem financiamento público não deveriam ofender os valores tradicionais da sociedade.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: +1, explanation: 'Debate se há critérios de conteúdo que devem ser aplicados à arte financiada com recursos públicos.' },
  { id: 47, text: 'A eutanásia deveria ser um direito garantido para pacientes em estado terminal e sofrimento insuportável.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: -1, explanation: 'É o procedimento de encerrar a vida de uma pessoa com doença terminal, a seu pedido.' },
  { id: 48, text: 'A redução da maioridade penal é uma medida necessária para combater a criminalidade entre jovens.', cluster: 'Direitos, Cultura e Ordem Social', axis: 'Social', direction: +1, explanation: 'É a proposta de diminuir a idade a partir da qual um adolescente pode ser julgado e punido como um adulto por seus crimes.' },

  // Cluster 5: Soberania, Geopolítica e Relações Internacionais
  { id: 49, text: 'A intervenção militar em outros países é justificável para proteger os direitos humanos ou a democracia.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: +1, explanation: 'É o uso de força militar por uma nação em outro país com a justificativa de proteger a população local contra violações de direitos humanos.' },
  { id: 50, text: 'O país deveria priorizar acordos comerciais com nações que compartilham seus valores democráticos, mesmo que isso signifique custos econômicos mais altos.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: +1, explanation: 'Discute se a política externa deve priorizar relações com países de regimes políticos similares ou focar em interesses econômicos e estratégicos, independentemente do sistema de governo do parceiro.' },
  { id: 51, text: 'O Brasil deve manter uma política externa neutra e pragmática, negociando igualmente com democracias e regimes autoritários.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: -1, explanation: 'É a postura de um país de não se alinhar automaticamente com nenhuma das grandes potências globais (como EUA ou China), buscando manter boas relações com todos.' },
  { id: 52, text: 'A participação em organizações supranacionais, como a ONU ou o Mercosul, muitas vezes compromete a soberania nacional e deveria ser limitada.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: +1, explanation: 'Debate se a participação em organizações como ONU ou Mercosul amplia a influência internacional de um país ou reduz sua autonomia decisória.' },
  { id: 53, text: 'O aumento significativo dos gastos militares é essencial para garantir a soberania e a defesa do país.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: +1, explanation: 'Refere-se ao debate sobre qual porcentagem do orçamento do país deve ser destinada às Forças Armadas para fins de defesa e projeção de poder.' },
  { id: 54, text: 'A globalização econômica, como um todo, beneficiou mais as corporações multinacionais do que os cidadãos comuns.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Econômico', direction: -1, explanation: 'É o processo de integração econômica entre países através de comércio, investimentos e fluxos financeiros transnacionais.' },
  { id: 55, text: 'O país deveria se alinhar a um dos grandes blocos de poder global (EUA ou China/Rússia) para garantir sua segurança e prosperidade.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: +1, explanation: 'É a estratégia de um país de estabelecer aliança formal com uma superpotência em troca de benefícios econômicos e de segurança.' },
  { id: 56, text: 'A proteção das fronteiras contra a imigração ilegal e o tráfico deve ser a principal prioridade da política externa.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: +1, explanation: 'É a priorização de investimentos e políticas para controlar a entrada de pessoas e produtos no território nacional.' },
  { id: 57, text: 'A ajuda humanitária e financeira a outros países é um dever moral, mesmo em tempos de dificuldade econômica interna.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Econômico', direction: -1, explanation: 'Refere-se ao envio de recursos financeiros ou materiais de um país para outras nações em situação de crise.' },
  { id: 58, text: 'O Brasil tem a responsabilidade de liderar a integração e a estabilidade política na América do Sul.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: +1, explanation: 'É a ideia de que um país, por seu tamanho e influência, deve assumir um papel central na coordenação política de sua região geográfica (ex: Brasil na América do Sul).' },
  { id: 59, text: 'Acordos internacionais sobre clima ou direitos humanos só devem ser ratificados se não prejudicarem a economia nacional.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Econômico', direction: +1, explanation: 'É a priorização dos interesses econômicos nacionais sobre compromissos de integração em tratados internacionais.' },
  { id: 60, text: 'O país deveria buscar a autossuficiência em tecnologias críticas, como semicondutores e equipamentos de defesa, mesmo a um custo elevado.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Econômico', direction: -1, explanation: 'É a estratégia de um país de desenvolver capacidade própria em setores tecnológicos críticos.' },
  { id: 61, text: 'Em um conflito entre grandes potências, a neutralidade é a única postura que serve aos interesses nacionais.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: -1, explanation: 'É a decisão de um país de não tomar partido quando duas ou mais grandes potências entram em guerra ou em uma grave disputa.' },
  { id: 62, text: 'A diplomacia e o "soft power" são mais eficazes do que o poder militar para alcançar objetivos de política externa.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: -1, explanation: 'Debate qual a ferramenta mais eficaz na política externa: a influência cultural e a negociação, ou a capacidade militar.' },
  { id: 63, text: 'A soberania nacional sobre a Amazônia é absoluta e não deve ser sujeita a qualquer tipo de supervisão ou interferência internacional.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: +1, explanation: 'É a defesa de que uma nação tem o direito exclusivo de decidir sobre a exploração de seus recursos naturais (como a Amazônia), sem ingerência internacional.' },
  { id: 64, text: 'O país deveria adotar uma postura mais assertiva no cenário mundial, defendendo ativamente seus interesses, mesmo que isso gere atritos diplomáticos.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: +1, explanation: 'Refere-se à defesa ativa dos interesses nacionais no cenário global, mesmo em situações de divergência com outros países.' },
  { id: 65, text: 'A cooperação internacional é a única forma de resolver problemas globais como pandemias, crises climáticas e terrorismo.', cluster: 'Soberania, Geopolítica e Relações Internacionais', axis: 'Social', direction: -1, explanation: 'É a visão de que os maiores desafios do mundo só podem ser resolvidos com a união e a colaboração de todos os países.' },
];

const clusters: string[] = [...new Set(propositions.map(p => p.cluster))];

// NOVAS PERSONALIDADES - Incluindo as pesquisadas pelo Gemini
const leaders: Leader[] = [
  // Quadrante Libertário de Direita
  { name: 'Renato Amoedo (30itão)', x: 10.0, y: -10.0, quadrant: 'Libertário de Direita', desc: 'Anarcocapitalista radical que defende a completa abolição do Estado.' },
  { name: 'Ayn Rand', x: 9.8, y: -9.5, quadrant: 'Libertário de Direita', desc: 'Filosofia do Objetivismo, defendendo o egoísmo racional e o capitalismo laissez-faire radical.' },
  { name: 'Ludwig von Mises', x: 9.8, y: -9.0, quadrant: 'Libertário de Direita', desc: 'Pioneiro da Escola Austríaca de economia, defensor do liberalismo clássico.' },
  { name: 'Milton Friedman', x: 9.0, y: -8.0, quadrant: 'Libertário de Direita', desc: 'Nobel de Economia (1976), expoente da Escola de Chicago, defensor do livre mercado.' },
  { name: 'Friedrich Hayek', x: 8.5, y: -8.5, quadrant: 'Libertário de Direita', desc: 'Nobel de Economia (1974), defensor do liberalismo clássico.' },
  { name: 'Thomas Sowell', x: 8.5, y: -6.5, quadrant: 'Libertário de Direita', desc: 'Economista defensor do livre mercado e crítico da intervenção estatal.' },
  { name: 'Renata J. Barreto', x: 8.5, y: -4.0, quadrant: 'Libertário de Direita', desc: 'Economista defensora do liberalismo econômico e da soberania individual.' },
  { name: 'Javier Milei', x: 9.5, y: -7.5, quadrant: 'Libertário de Direita', desc: 'Propostas de minimização radical do Estado e livre mercado.' },
  { name: 'Emmanuel Macron', x: 4.5, y: -1.9, quadrant: 'Libertário de Direita', desc: 'Liberalismo econômico (cortes de impostos) com progressismo sociocultural.' },
  
  // Quadrante Autoritário de Direita
  { name: 'Olavo de Carvalho', x: 8.0, y: 7.5, quadrant: 'Autoritário de Direita', desc: 'Filósofo tradicionalista que defendia ordem social conservadora e nacionalista.' },
  { name: 'Margaret Thatcher', x: 8.0, y: 7.5, quadrant: 'Autoritário de Direita', desc: 'Políticas de privatização com forte nacionalismo e centralização do poder.' },
  { name: 'Ronald Reagan', x: 7.5, y: 7.0, quadrant: 'Autoritário de Direita', desc: 'Reaganomics (cortes de impostos) com conservadorismo social.' },
  { name: 'Jair Bolsonaro', x: 6.5, y: 7.0, quadrant: 'Autoritário de Direita', desc: 'Agenda econômica liberal com retórica nacionalista e autoritária.' },
  { name: 'Donald Trump', x: 6.0, y: 6.5, quadrant: 'Autoritário de Direita', desc: 'Cortes de impostos com protecionismo, nacionalismo e populismo.' },
  { name: 'Benjamin Netanyahu', x: 7.0, y: 7.5, quadrant: 'Autoritário de Direita', desc: 'Políticas neoliberais com postura de segurança linha-dura.' },
  { name: 'Winston Churchill', x: 5.0, y: 6.0, quadrant: 'Autoritário de Direita', desc: 'Defensor do livre mercado com imperialismo e monarquismo.' },
  { name: 'Andrzej Duda', x: 5.0, y: 6.0, quadrant: 'Autoritário de Direita', desc: 'Presidente conservador da Polônia com reformas autoritárias.' },
  { name: 'Vladimir Putin', x: 4.0, y: 8.5, quadrant: 'Autoritário de Direita', desc: 'Poder centralizado, nacionalismo e controle estatal de setores estratégicos.' },
  
  // Quadrante Libertário de Esquerda
  { name: 'Mahatma Gandhi', x: -6.0, y: -9.0, quadrant: 'Libertário de Esquerda', desc: 'Modelo de bem-estar Sarvodaya com filosofia de resistência não-violenta.' },
  { name: 'Nelson Mandela', x: -6.5, y: -8.0, quadrant: 'Libertário de Esquerda', desc: 'Líder anti-apartheid que defendeu justiça social em estrutura democrática.' },
  { name: 'Bernie Sanders', x: -7.5, y: -6.5, quadrant: 'Libertário de Esquerda', desc: 'Defensor do socialismo democrático com saúde e educação universais.' },
  { name: 'Justin Trudeau', x: -5.5, y: -6.0, quadrant: 'Libertário de Esquerda', desc: 'Expansão de programas sociais com políticas progressistas.' },
  { name: 'Barack Obama', x: -4.0, y: -2.0, quadrant: 'Libertário de Esquerda', desc: 'Affordable Care Act com postura progressista em questões sociais.' },
  
  // Quadrante Centro-Autoritário
  { name: 'Lula da Silva', x: -5.5, y: 3.5, quadrant: 'Centro-Autoritário', desc: 'Social-democracia desenvolvimentista com pragmatismo econômico. Políticas redistributivas (Bolsa Família) mantendo tripé macroeconômico ortodoxo. Democracia com tendências de aparelhamento institucional e alianças com regimes autoritários.' },
  { name: 'Kim Jong Un', x: -9.8, y: 10.0, quadrant: 'Autoritário de Esquerda', desc: 'Economia centralizada e regime totalitário.' },
  { name: 'Mao Zedong', x: -9.8, y: 9.8, quadrant: 'Autoritário de Esquerda', desc: 'Fundador da RPC com Grande Salto Adiante e Revolução Cultural.' },
  { name: 'Joseph Stalin', x: -9.5, y: 9.5, quadrant: 'Autoritário de Esquerda', desc: 'Economia planificada e regime totalitário baseado no terror.' },
  { name: 'Vladimir Lenin', x: -9.0, y: 9.5, quadrant: 'Autoritário de Esquerda', desc: 'Líder da Revolução Bolchevique com Estado de partido único.' },
  { name: 'Xi Jinping', x: -8.5, y: 9.8, quadrant: 'Autoritário de Esquerda', desc: 'Controle total do PC sobre economia e sociedade.' },
  { name: 'Karl Marx', x: -10.0, y: 9.0, quadrant: 'Autoritário de Esquerda', desc: 'Teoria da ditadura do proletariado.' },
  { name: 'Fidel Castro', x: -8.0, y: 8.5, quadrant: 'Autoritário de Esquerda', desc: 'Estado comunista com nacionalização e repressão.' },
  { name: 'Nicolás Maduro', x: -7.0, y: 9.0, quadrant: 'Autoritário de Esquerda', desc: 'Regime autoritário com economia de controle estatal.' },
  
  // Quadrante Centro-Autoritário
  { name: 'F. D. Roosevelt', x: -5.0, y: 5.5, quadrant: 'Centro-Autoritário', desc: 'New Deal com expansão do poder executivo federal.' },
  { name: 'Lula da Silva', x: -5.5, y: 3.5, quadrant: 'Centro-Autoritário', desc: 'Social-democracia desenvolvimentista com pragmatismo econômico. Políticas redistributivas (Bolsa Família) mantendo tripé macroeconômico ortodoxo. Democracia com tendências de aparelhamento institucional e alianças com regimes autoritários.' },
  { name: 'Juan Perón', x: -1.0, y: 2.5, quadrant: 'Centro-Autoritário', desc: 'Terceira Posição: economia mista com populismo autoritário e corporativismo.' },
  { name: 'Fumio Kishida', x: -3.0, y: 5.0, quadrant: 'Centro-Autoritário', desc: 'Novo capitalismo com redistribuição e nacionalismo.' },
  
  // NOVAS PERSONALIDADES DE CENTRO (baseadas na pesquisa do Gemini)
  
  // Centro-Esquerda (moderadamente esquerda, social neutro)
  { name: 'Clement Attlee', x: -5.0, y: 0.5, quadrant: 'Centro-Esquerda', desc: 'PM britânico que criou o NHS e nacionalizou setores chave, operando em quadro democrático robusto.' },
  { name: 'François Mitterrand', x: -4.5, y: -1.0, quadrant: 'Centro-Esquerda', desc: 'Presidência francesa com agenda inicial de esquerda, mas virada para austeridade em 1983.' },
  
  // Centro-Direita (moderadamente direita, social neutro)
  { name: 'David Cameron', x: 2.5, y: -1.0, quadrant: 'Centro-Direita', desc: 'Austeridade econômica com agenda socialmente liberal (casamento igualitário).' },
  { name: 'Angela Merkel', x: 2.8, y: -0.5, quadrant: 'Centro-Direita', desc: 'Conservadorismo fiscal com pragmatismo social (portas abertas em 2015).' },
  
  // Autoritário de Centro (extremamente autoritário, econômico neutro)
  { name: 'Adolf Hitler', x: 0.0, y: 10.0, quadrant: 'Autoritário de Centro', desc: 'Regime totalitário fascista com extremo nacionalismo e controle estatal-corporativista da economia.' },
  { name: 'Lee Kuan Yew', x: 1.5, y: 7.0, quadrant: 'Autoritário de Centro', desc: 'Modelo de Singapura: capitalismo de estado pragmático com controle social autoritário extremo.' },
  { name: 'Papa Leão XIII', x: -1.0, y: 7.0, quadrant: 'Autoritário de Centro', desc: 'Autor da Rerum Novarum, criticou socialismo e capitalismo liberal, defendendo justiça social sob doutrina moral hierárquica.' },
  
  // Centro-Libertário (levemente libertário, econômico neutro)
  { name: 'Annalena Baerbock', x: -1.5, y: -2.8, quadrant: 'Centro-Libertário', desc: 'Economia socio-ecológica dos Verdes alemães com forte foco em liberdades civis.' },
  
  // Libertário de Centro (extremamente libertário, econômico neutro)
  { name: 'Václav Havel', x: -0.5, y: -7.5, quadrant: 'Libertário de Centro', desc: 'Viver na verdade: direitos humanos e dignidade individual com pragmatismo econômico.' },
  { name: 'Mahmoud Abbas', x: -3.0, y: 7.5, quadrant: 'Autoritário de Esquerda', desc: 'Líder da Autoridade Palestina com economia mista e governo centralizado.' },
  { name: 'Masoud Pezeshkian', x: -4.0, y: 8.0, quadrant: 'Autoritário de Esquerda', desc: 'Reformista no Irã em sistema teocrático autoritário.' },
];

// Função ATUALIZADA para obter personalidades por proximidade
const getTopPersonalities = (quadrant: string, userX: number, userY: number): string[] => {
  const curatedLists: Record<string, string[]> = {
    'Libertário de Direita': ['Milton Friedman', 'Friedrich Hayek', 'Emmanuel Macron'],
    'Autoritário de Direita': ['Margaret Thatcher', 'Donald Trump', 'Jair Bolsonaro'],
    'Libertário de Esquerda': ['Bernie Sanders', 'Nelson Mandela', 'Barack Obama'],
    'Autoritário de Esquerda': ['Joseph Stalin', 'Xi Jinping', 'Fidel Castro'],
    'Centro': [],
    'Centro-Esquerda': ['Clement Attlee', 'François Mitterrand'],
    'Centro-Direita': ['David Cameron', 'Angela Merkel'],
    'Centro-Autoritário': ['Juan Perón', 'F. D. Roosevelt', 'Lula da Silva'],
    'Centro-Libertário': ['Annalena Baerbock'],
    'Autoritário de Centro': ['Adolf Hitler', 'Lee Kuan Yew', 'Papa Leão XIII'],
    'Libertário de Centro': ['Václav Havel'],
    'Direita de Centro': [],
    'Esquerda de Centro': []
  };
  
  if (curatedLists[quadrant] && curatedLists[quadrant].length > 0) {
    return curatedLists[quadrant];
  }
  
  const distances = leaders.map(leader => ({
    name: leader.name,
    distance: Math.sqrt(Math.pow(leader.x - userX, 2) + Math.pow(leader.y - userY, 2))
  }));
  
  distances.sort((a, b) => a.distance - b.distance);
  return distances.slice(0, 3).map(d => d.name);
};

const getQuadrantColors = (quadrant: string) => {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    'Libertário de Direita': {
      bg: 'bg-blue-100',
      border: 'border-blue-600',
      text: 'text-blue-900'
    },
    'Autoritário de Direita': {
      bg: 'bg-red-100',
      border: 'border-red-600',
      text: 'text-red-900'
    },
    'Libertário de Esquerda': {
      bg: 'bg-emerald-100',
      border: 'border-emerald-600',
      text: 'text-emerald-900'
    },
    'Autoritário de Esquerda': {
      bg: 'bg-amber-100',
      border: 'border-amber-600',
      text: 'text-amber-900'
    },
    'Centro': {
      bg: 'bg-gray-100',
      border: 'border-gray-500',
      text: 'text-gray-700'
    },
    'Centro-Esquerda': {
      bg: 'bg-teal-50',
      border: 'border-teal-500',
      text: 'text-teal-900'
    },
    'Centro-Direita': {
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      text: 'text-orange-900'
    },
    'Centro-Autoritário': {
      bg: 'bg-purple-100',
      border: 'border-purple-400',
      text: 'text-purple-900'
    },
    'Centro-Libertário': {
      bg: 'bg-cyan-100',
      border: 'border-cyan-400',
      text: 'text-cyan-900'
    },
    'Autoritário de Centro': {
      bg: 'bg-purple-200',
      border: 'border-purple-700',
      text: 'text-purple-950'
    },
    'Libertário de Centro': {
      bg: 'bg-cyan-200',
      border: 'border-cyan-600',
      text: 'text-cyan-950'
    },
    'Direita de Centro': {
      bg: 'bg-orange-200',
      border: 'border-orange-600',
      text: 'text-orange-950'
    },
    'Esquerda de Centro': {
      bg: 'bg-teal-200',
      border: 'border-teal-600',
      text: 'text-teal-950'
    }
  };
  return colors[quadrant] || colors['Centro'];
};

const PoliticalCompassTest: React.FC = () => {
  const [step, setStep] = useState<string>('intro');
  const [userName, setUserName] = useState<string>('');
  const [currentClusterIndex, setCurrentClusterIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<Result | null>(null);
  const [hoveredLeader, setHoveredLeader] = useState<Leader | null>(null);
  const [showAppendix, setShowAppendix] = useState<boolean>(false);
  const [showSystemExplanation, setShowSystemExplanation] = useState<boolean>(false);
  const [visibleTooltipId, setVisibleTooltipId] = useState<number | null>(null);
  const [shareMessage, setShareMessage] = useState<string>('');
  const topRef = useRef<HTMLDivElement>(null);

  const getPointColor = (quadrant: string): string => {
    const colors: Record<string, string> = {
      'Libertário de Direita': '#2563eb',
      'Autoritário de Direita': '#dc2626',
      'Libertário de Esquerda': '#059669',
      'Autoritário de Esquerda': '#d97706',
      'Centro': '#6b7280',
      'Centro-Autoritário': '#c084fc',
      'Centro-Libertário': '#67e8f9',
      'Centro-Esquerda': '#5eead4',
      'Centro-Direita': '#fdba74',
      'Autoritário de Centro': '#9333ea',
      'Libertário de Centro': '#06b6d4',
      'Direita de Centro': '#f97316',
      'Esquerda de Centro': '#14b8a6'
    };
    return colors[quadrant] || '#8b5cf6';
  };

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentClusterIndex, step]);

  const generateShareText = (result: Result, userName: string, quadrant: string): string => {
    const personalities = getTopPersonalities(quadrant, result.economic, result.social);
    const namePrefix = userName ? `${userName}: ` : '';
    const economicLabel = result.economic > 0 ? 'Pró-Livre Mercado' : 'Pró-Regulação';
    const socialLabel = result.social > 0 ? 'Pró-Autoridade Coletiva' : 'Pró-Soberania Individual';
    
    return `🧭 Bússola Política - Meu Resultado

${namePrefix}${quadrant}
Econômico: ${result.economic > 0 ? '+' : ''}${result.economic.toFixed(1)} (${economicLabel})
Social: ${result.social > 0 ? '+' : ''}${result.social.toFixed(1)} (${socialLabel})

Personalidades nesta categoria:
${personalities.join(', ')}

Faça você também: https://bussola-politica.vercel.app/`;
  };

  const handleShare = async (): Promise<void> => {
    if (!result) return;
    
    const quadrant = getQuadrantLabel(result.economic, result.social);
    const text = generateShareText(result, userName, quadrant);
    
    try {
      if (navigator.share) {
        await navigator.share({ text });
        setShareMessage('Compartilhado com sucesso!');
      } else {
        await navigator.clipboard.writeText(text);
        setShareMessage('Resultado copiado para a área de transferência!');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setShareMessage('Resultado copiado para a área de transferência!');
      } catch {
        setShareMessage('Não foi possível compartilhar. Tente novamente.');
      }
    }
    
    setTimeout(() => setShareMessage(''), 3000);
  };

  const handleAnswer = (questionId: number, value: number): void => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const calculateResult = (): void => {
    let economicScoreSum = 0;
    let socialScoreSum = 0;
    let economicCount = 0;
    let socialCount = 0;

    propositions.forEach(prop => {
      const answerValue = answers[prop.id];
      if (answerValue !== undefined) {
        const score = answerValue * prop.direction;
        if (prop.axis === 'Econômico') {
          economicScoreSum += score;
          economicCount++;
        } else if (prop.axis === 'Social') {
          socialScoreSum += score;
          socialCount++;
        }
      }
    });

    const finalX = (economicScoreSum / economicCount) * 10;
    const finalY = (socialScoreSum / socialCount) * 10;

    setResult({
      economic: Math.max(-10, Math.min(10, finalX || 0)),
      social: Math.max(-10, Math.min(10, finalY || 0)),
    });
    setStep('result');
  };
  
  const nextCluster = (): void => {
    if (currentClusterIndex < clusters.length - 1) {
      setCurrentClusterIndex(currentClusterIndex + 1);
    } else {
      calculateResult();
    }
  };

  const allQuestionsInClusterAnswered = (): boolean => {
    const currentClusterName = clusters[currentClusterIndex];
    const clusterQuestions = propositions.filter(p => p.cluster === currentClusterName);
    return clusterQuestions.every(q => answers[q.id] !== undefined);
  };

  const getQuadrantLabel = (x: number, y: number): string => {
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const threshold_centro = 1.5;
    const threshold_moderado = 3.0;
    
    if (absX <= threshold_centro && absY <= threshold_centro) {
      return 'Centro';
    }
    
    if (absX <= threshold_centro && y > threshold_centro && y <= threshold_moderado) {
      return 'Centro-Autoritário';
    }
    if (absX <= threshold_centro && y < -threshold_centro && y >= -threshold_moderado) {
      return 'Centro-Libertário';
    }
    if (x < -threshold_centro && x >= -threshold_moderado && absY <= threshold_centro) {
      return 'Centro-Esquerda';
    }
    if (x > threshold_centro && x <= threshold_moderado && absY <= threshold_centro) {
      return 'Centro-Direita';
    }
    
    if (absX <= threshold_centro && y > threshold_moderado) {
      return 'Autoritário de Centro';
    }
    if (absX <= threshold_centro && y < -threshold_moderado) {
      return 'Libertário de Centro';
    }
    if (x > threshold_moderado && absY <= threshold_centro) {
      return 'Direita de Centro';
    }
    if (x < -threshold_moderado && absY <= threshold_centro) {
      return 'Esquerda de Centro';
    }
    
    if (x > threshold_centro && y > threshold_centro) {
      return 'Autoritário de Direita';
    }
    if (x < -threshold_centro && y > threshold_centro) {
      return 'Autoritário de Esquerda';
    }
    if (x < -threshold_centro && y < -threshold_centro) {
      return 'Libertário de Esquerda';
    }
    if (x > threshold_centro && y < -threshold_centro) {
      return 'Libertário de Direita';
    }
    
    return 'Centro';
  };
  
  const responseOptions = [
    { label: 'Discordo Totalmente', value: -1.0 },
    { label: 'Discordo', value: -0.5 },
    { label: 'Concordo', value: 0.5 },
    { label: 'Concordo Totalmente', value: 1.0 },
  ];

  if (step === 'intro') {
    return (
      <div ref={topRef} className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <BarChart3 className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Bússola Política</h1>
            <p className="text-lg text-gray-600">
              Teste atualizado em 2025 para mapear sua ideologia no cenário político contemporâneo.
            </p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-indigo-900 mb-3">Como funciona:</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start"><span className="text-indigo-600 mr-2">•</span><span>Responda as proposições sobre temas atuais, leva somente 10min.</span></li>
              <li className="flex items-start"><span className="text-indigo-600 mr-2">•</span><span>A metodologia é 100% transparente, baseada em uma <a href="https://docs.google.com/document/d/1LYHuFfzksuT1hx06NU2nQb20jeBUkwgrxSwXOhC4dNc/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline hover:text-indigo-900">metodologia detalhada</a>.</span></li>
              <li className="flex items-start"><span className="text-indigo-600 mr-2">•</span><span>Se fechar a aba do navegador, tudo é perdido; não gravamos dados.</span></li>
              <li className="flex items-start"><span className="text-indigo-600 mr-2">•</span><span>Veja sua posição comparada a líderes mundiais e históricos.</span></li>
            </ul>
          </div>
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 mb-6">
            <div className="flex items-start">
              <span className="text-2xl mr-3">ℹ️</span>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Aviso Importante</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Este teste tem caráter <strong>exclusivamente lúdico e educacional</strong>. Não possui viés político, validação científica, nem representa a opinião do desenvolvedor. O posicionamento das personalidades e o algoritmo foram elaborados com auxílio de IA para fins ilustrativos.
                </p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label className="flex items-center text-gray-700 font-medium mb-2"><User className="w-5 h-5 mr-2" />Seu nome (opcional):</label>
            <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            placeholder="Digite para personalizar seu resultado" 
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition text-gray-900 placeholder:text-gray-500"/>
          </div>
          <button onClick={() => setStep('test')} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition flex items-center justify-center">
            Começar Teste <ChevronRight className="w-6 h-6 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'test') {
    const clusterName = clusters[currentClusterIndex];
    const questionsForCluster = propositions.filter(p => p.cluster === clusterName);
    const progress = ((currentClusterIndex + 1) / clusters.length) * 100;

    return (
      <div ref={topRef} className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-indigo-600">Cluster {currentClusterIndex + 1} de {clusters.length}</span>
                <span className="text-sm font-semibold text-gray-600">{Math.round(progress)}% concluído</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-indigo-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
              </div>
            </div>
            <div className="mb-8"><h2 className="text-3xl font-bold text-gray-900 mb-2">{clusterName}</h2></div>
            <div className="space-y-6">
              {questionsForCluster.map((question) => (
                <div key={question.id} className="bg-gray-50 rounded-xl p-6 border">
                  <div className="flex items-start mb-4">
                    <p className="text-lg font-medium text-gray-800 flex-1">{question.text}</p>
                    <div className="relative ml-2">
                      <HelpCircle 
                        className="w-5 h-5 text-gray-500 cursor-pointer hover:text-indigo-600 transition flex-shrink-0"
                        onMouseEnter={() => setVisibleTooltipId(question.id)}
                        onMouseLeave={() => setVisibleTooltipId(null)}
                        onClick={() => setVisibleTooltipId(visibleTooltipId === question.id ? null : question.id)}
                      />
                      {visibleTooltipId === question.id && (
                        <div className="absolute left-0 top-7 bg-gray-800 text-white text-xs rounded-md p-3 shadow-lg z-10 max-w-xs w-64">
                          {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {responseOptions.map(opt => (
                      <button key={opt.value} onClick={() => handleAnswer(question.id, opt.value)} className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${answers[question.id] === opt.value ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-300'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={nextCluster} disabled={!allQuestionsInClusterAnswered()} className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center transition ${allQuestionsInClusterAnswered() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              {currentClusterIndex < clusters.length - 1 ? 'Próximo Assunto' : 'Ver Resultado'}
              <ChevronRight className="w-6 h-6 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result' && result) {
    const quadrant = getQuadrantLabel(result.economic, result.social);
    const personalities = getTopPersonalities(quadrant, result.economic, result.social);
    
    const categoryDescriptions: Record<string, string> = {
      'Centro': 'Posicionamento equilibrado, próximo da neutralidade em ambos os eixos',
      'Centro-Esquerda': 'Moderadamente favorável à regulação econômica, com postura social neutra',
      'Centro-Direita': 'Moderadamente favorável ao livre mercado, com postura social neutra',
      'Centro-Autoritário': 'Levemente favorável à autoridade coletiva, com economia neutra',
      'Centro-Libertário': 'Levemente favorável à soberania individual, com economia neutra',
      'Esquerda de Centro': 'Fortemente favorável à regulação econômica, com postura social neutra',
      'Direita de Centro': 'Fortemente favorável ao livre mercado, com postura social neutra',
      'Autoritário de Centro': 'Fortemente favorável à autoridade coletiva, com economia neutra',
      'Libertário de Centro': 'Fortemente favorável à soberania individual, com economia neutra',
      'Libertário de Direita': 'Defende livre mercado e soberania individual',
      'Autoritário de Direita': 'Defende livre mercado e autoridade coletiva',
      'Libertário de Esquerda': 'Defende regulação econômica e soberania individual',
      'Autoritário de Esquerda': 'Defende regulação econômica e autoridade coletiva'
    };
    
    return (
      <div ref={topRef} className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Seu Resultado</h1>
              {userName && <h2 className="text-2xl text-indigo-600 font-semibold">{userName}</h2>}
            </div>
            
            <div className={`${getQuadrantColors(quadrant).bg} ${getQuadrantColors(quadrant).border} border-4 rounded-2xl p-6 mb-8`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  {userName ? `${userName}, você se posiciona em:` : 'Você se posiciona em:'}
                </p>
                <h2 className={`text-3xl font-bold mb-2 ${getQuadrantColors(quadrant).text}`}>
                  🧭 {quadrant.toUpperCase()}
                </h2>
                <p className="text-sm text-gray-700 mb-4 italic">
                  {categoryDescriptions[quadrant]}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  Personalidades nesta categoria:
                </p>
                <p className={`text-base font-semibold ${getQuadrantColors(quadrant).text}`}>
                  {personalities.join(', ')}
                </p>
              </div>
            </div>
            
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Eixo Econômico (X)</h3>
                <p className="text-3xl font-bold text-blue-700">{result.economic > 0 ? '+' : ''}{result.economic.toFixed(1)}</p>
                <p className="text-sm text-blue-600 mt-1">{result.economic > 0 ? 'Pró-Livre Mercado' : 'Pró-Regulação'}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-2">Eixo Social (Y)</h3>
                <p className="text-3xl font-bold text-red-700">{result.social > 0 ? '+' : ''}{result.social.toFixed(1)}</p>
                <p className="text-sm text-red-600 mt-1">{result.social > 0 ? 'Pró-Autoridade Coletiva' : 'Pró-Soberania Individual'}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-2 sm:p-6 mb-6 relative">
              {hoveredLeader && (
                <div className="absolute top-2 right-2 bg-white rounded-lg shadow-xl p-2 z-20 border border-gray-200 max-w-xs">
                  <p className="font-bold text-gray-900 text-sm">{hoveredLeader.name}</p>
                  <p className="text-xs text-indigo-600 mt-1">{hoveredLeader.quadrant}</p>
                  <p className="text-xs text-gray-500 mt-2">{hoveredLeader.desc}</p>
                </div>
              )}
              <svg id="compass-chart" viewBox="-200 -130 400 260" className="w-full">
                <defs>
                    <linearGradient id="grad-auth-right" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f87171" stopOpacity="0.2"/><stop offset="100%" stopColor="#FDE68A" stopOpacity="0.2"/></linearGradient>
                    <linearGradient id="grad-auth-left" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f87171" stopOpacity="0.2"/><stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.2"/></linearGradient>
                    <linearGradient id="grad-lib-left" x1="1" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2"/><stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.2"/></linearGradient>
                    <linearGradient id="grad-lib-right" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#60A5FA" stopOpacity="0.2"/><stop offset="100%" stopColor="#FDE68A" stopOpacity="0.2"/></linearGradient>
                </defs>
                <rect x="0" y="-100" width="100" height="100" fill="url(#grad-auth-right)" />
                <rect x="-100" y="-100" width="100" height="100" fill="url(#grad-auth-left)" />
                <rect x="-100" y="0" width="100" height="100" fill="url(#grad-lib-left)" />
                <rect x="0" y="0" width="100" height="100" fill="url(#grad-lib-right)" />
                <g opacity="0.2">{[-80, -60, -40, -20, 20, 40, 60, 80].map(pos => (<g key={pos}><line x1={pos} y1="-100" x2={pos} y2="100" stroke="#000" strokeWidth="0.5"/><line x1="-100" y1={pos} x2="100" y2={pos} stroke="#000" strokeWidth="0.5"/></g>))}</g>
                <line x1="-100" y1="0" x2="100" y2="0" stroke="#374151" strokeWidth="1.5" />
                <line x1="0" y1="-100" x2="0" y2="100" stroke="#374151" strokeWidth="1.5" />
                
                <line x1="-15" y1="-100" x2="-15" y2="100" stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                <line x1="15" y1="-100" x2="15" y2="100" stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                <line x1="-100" y1="-15" x2="100" y2="-15" stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                <line x1="-100" y1="15" x2="100" y2="15" stroke="#9ca3af" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                
                <line x1="-30" y1="-100" x2="-30" y2="100" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.25" />
                <line x1="30" y1="-100" x2="30" y2="100" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.25" />
                <line x1="-100" y1="-30" x2="100" y2="-30" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.25" />
                <line x1="-100" y1="30" x2="100" y2="30" stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.25" />
                
                <text x="110" y="5" fontSize="7" textAnchor="start" fill="#1f2937">Livre Mercado</text>
                <text x="-110" y="5" fontSize="7" textAnchor="end" fill="#1f2937">Economia Regulada</text>
                <text x="0" y="-105" fontSize="7" textAnchor="middle" fill="#1f2937">Autoridade Coletiva</text>
                <text x="0" y="112" fontSize="7" textAnchor="middle" fill="#1f2937">Soberania Individual</text>
                
                {leaders.map((leader, idx) => (
                    <circle 
                      key={idx} 
                      cx={leader.x * 10} 
                      cy={-leader.y * 10} 
                      r="3" 
                      fill={getPointColor(leader.quadrant)} 
                      fillOpacity="0.85"
                      stroke="white"
                      strokeWidth="0.5"
                      className="cursor-pointer hover:r-4 transition-all" 
                      onMouseEnter={() => setHoveredLeader(leader)} 
                      onMouseLeave={() => setHoveredLeader(null)}
                    >
                        <title>{leader.name}</title>
                    </circle>
                ))}
                <g>
                    <circle cx={result.economic * 10} cy={-result.social * 10} r="6" fill="#6366F1" fillOpacity="0.3" />
                    <circle cx={result.economic * 10} cy={-result.social * 10} r="3" fill="#6366F1" />
                    <text x={result.economic * 10} y={-result.social * 10 - 8} fontSize="10" textAnchor="middle" fontWeight="bold" fill="#6366F1">VOCÊ</text>
                </g>
              </svg>
            </div>
            
            <div className="mb-6">
              <button
                onClick={handleShare}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
                Compartilhar Resultado
              </button>
              
              {shareMessage && (
                <div className="mt-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center animate-fade-in">
                  {shareMessage}
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <button
                onClick={() => setShowSystemExplanation(!showSystemExplanation)}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center"
              >
                📖 {showSystemExplanation ? 'Ocultar' : 'Entenda o'} Sistema de 13 Categorias
                <ChevronRight className={`w-5 h-5 ml-2 transform transition ${showSystemExplanation ? 'rotate-90' : ''}`} />
              </button>
              
              {showSystemExplanation && (
                <div className="mt-4 bg-gray-50 rounded-xl p-6 border">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">📊 Sistema de 13 Categorias</h3>
                  
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                      Este teste mapeia posições políticas usando <strong>dois eixos independentes</strong>:
                    </p>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="font-bold text-blue-900 mb-2">🔵 EIXO ECONÔMICO (Horizontal - X)</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div>
                          <strong className="text-emerald-700">• Esquerda (-10):</strong> Economia Regulada
                          <p className="ml-4 text-gray-600">→ Intervenção estatal, impostos progressivos sobre super-ricos, empresas estatais, controle de mercado</p>
                        </div>
                        <div>
                          <strong className="text-blue-700">• Direita (+10):</strong> Livre Mercado
                          <p className="ml-4 text-gray-600">→ Desregulamentação, baixos impostos, privatizações, livre comércio, propriedade privada irrestrita</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-bold text-red-900 mb-2">🔴 EIXO SOCIAL (Vertical - Y)</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div>
                          <strong className="text-red-700">• Topo (+10):</strong> Autoridade Coletiva
                          <p className="ml-4 text-gray-600">→ Ordem social, valores tradicionais, segurança prioritária, controle estatal sobre comportamento</p>
                        </div>
                        <div>
                          <strong className="text-cyan-700">• Base (-10):</strong> Soberania Individual
                          <p className="ml-4 text-gray-600">→ Liberdades civis, direitos individuais, mínima interferência do Estado na vida privada</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">🟦 QUADRANTES PRINCIPAIS (4)</h4>
                      <p className="text-sm text-gray-600 mb-3">Forte posicionamento em AMBOS os eixos:</p>
                      
                      <div className="space-y-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="font-semibold text-blue-900">• Libertário de Direita (X &gt; +3, Y &lt; -3)</p>
                          <p className="text-sm text-gray-700 ml-4">Livre mercado + Liberdades individuais</p>
                          <p className="text-xs text-gray-600 ml-4">Ex: Milton Friedman, Hayek, Milei</p>
                        </div>
                        
                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="font-semibold text-red-900">• Autoritário de Direita (X &gt; +3, Y &gt; +3)</p>
                          <p className="text-sm text-gray-700 ml-4">Livre mercado + Autoridade coletiva</p>
                          <p className="text-xs text-gray-600 ml-4">Ex: Thatcher, Reagan, Bolsonaro</p>
                        </div>
                        
                        <div className="bg-emerald-50 rounded-lg p-3">
                          <p className="font-semibold text-emerald-900">• Libertário de Esquerda (X &lt; -3, Y &lt; -3)</p>
                          <p className="text-sm text-gray-700 ml-4">Economia regulada + Liberdades individuais</p>
                          <p className="text-xs text-gray-600 ml-4">Ex: Bernie Sanders, Mandela, Obama</p>
                        </div>
                        
                        <div className="bg-amber-50 rounded-lg p-3">
                          <p className="font-semibold text-amber-900">• Autoritário de Esquerda (X &lt; -3, Y &gt; +3)</p>
                          <p className="text-sm text-gray-700 ml-4">Economia regulada + Autoridade coletiva</p>
                          <p className="text-xs text-gray-600 ml-4">Ex: Stalin, Mao, Castro</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">⚪ CENTRO (1)</h4>
                      <p className="text-sm text-gray-600 mb-3">Neutralidade em AMBOS os eixos:</p>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-900">• Centro (-1.5 a +1.5 em ambos os eixos)</p>
                        <p className="text-sm text-gray-700 ml-4">Equilíbrio entre mercado/regulação e autoridade/liberdade</p>
                        <p className="text-xs text-gray-600 ml-4">Perfil: Pragmatismo, soluções case-by-case</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">🟨 SUBCENTROS (4)</h4>
                      <p className="text-sm text-gray-600 mb-3">Moderadamente inclinados em UMA direção:</p>
                      
                      <div className="space-y-3">
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="font-semibold text-orange-900">• Centro-Direita (X: +1.5 a +3, Y: -1.5 a +1.5)</p>
                          <p className="text-sm text-gray-700 ml-4">Moderadamente pró-livre mercado, social neutro</p>
                          <p className="text-xs text-gray-600 ml-4">Ex: Merkel, Cameron</p>
                        </div>
                        
                        <div className="bg-teal-50 rounded-lg p-3">
                          <p className="font-semibold text-teal-900">• Centro-Esquerda (X: -1.5 a -3, Y: -1.5 a +1.5)</p>
                          <p className="text-sm text-gray-700 ml-4">Moderadamente pró-regulação, social neutro</p>
                          <p className="text-xs text-gray-600 ml-4">Ex: Attlee, Mitterrand</p>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="font-semibold text-purple-900">• Centro-Autoritário (X: -1.5 a +1.5, Y: +1.5 a +3)</p>
                          <p className="text-sm text-gray-700 ml-4">Economia neutra, moderadamente autoritário</p>
                          <p className="text-xs text-gray-600 ml-4">Ex: Perón, Roosevelt, Lula</p>
                        </div>
                        
                        <div className="bg-cyan-50 rounded-lg p-3">
                          <p className="font-semibold text-cyan-900">• Centro-Libertário (X: -1.5 a +1.5, Y: -1.5 a -3)</p>
                          <p className="text-sm text-gray-700 ml-4">Economia neutra, moderadamente libertário</p>
                          <p className="text-xs text-gray-600 ml-4">Ex: Baerbock (Verdes alemães)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">🔶 EXTREMOS DE TRANSIÇÃO (4)</h4>
                      <p className="text-sm text-gray-600 mb-3">Fortemente inclinados em UM eixo, neutros no outro:</p>
                      
                      <div className="space-y-3">
                        <div className="bg-purple-100 rounded-lg p-3">
                          <p className="font-semibold text-purple-950">• Autoritário de Centro (X: -1.5 a +1.5, Y &gt; +3)</p>
                          <p className="text-sm text-gray-700 ml-4">Economia neutra, fortemente autoritário</p>
                          <p className="text-xs text-gray-600 ml-4">Ex: Hitler, Lee Kuan Yew, Papa Leão XIII</p>
                        </div>
                        
                        <div className="bg-cyan-100 rounded-lg p-3">
                          <p className="font-semibold text-cyan-950">• Libertário de Centro (X: -1.5 a +1.5, Y &lt; -3)</p>
                          <p className="text-sm text-gray-700 ml-4">Economia neutra, fortemente libertário</p>
                          <p className="text-xs text-gray-600 ml-4">Ex: Václav Havel</p>
                        </div>
                        
                        <div className="bg-orange-100 rounded-lg p-3">
                          <p className="font-semibold text-orange-950">• Direita de Centro (X &gt; +3, Y: -1.5 a +1.5)</p>
                          <p className="text-sm text-gray-700 ml-4">Fortemente pró-livre mercado, social neutro</p>
                          <p className="text-xs text-gray-600 ml-4">Liberalismo econômico radical com pragmatismo social</p>
                        </div>
                        
                        <div className="bg-teal-100 rounded-lg p-3">
                          <p className="font-semibold text-teal-950">• Esquerda de Centro (X &lt; -3, Y: -1.5 a +1.5)</p>
                          <p className="text-sm text-gray-700 ml-4">Fortemente pró-regulação, social neutro</p>
                          <p className="text-xs text-gray-600 ml-4">Intervencionismo econômico forte com pragmatismo social</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <button
                onClick={() => setShowAppendix(!showAppendix)}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center"
              >
                {showAppendix ? 'Ocultar' : 'Mostrar'} Guia de Líderes e Pensadores
                <ChevronRight className={`w-5 h-5 ml-2 transform transition ${showAppendix ? 'rotate-90' : ''}`} />
              </button>
              
              {showAppendix && (
                <div className="mt-4 bg-gray-50 rounded-xl p-6 border">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Posicionamento de Líderes e Pensadores</h3>
                  
                  <div className="space-y-4">
                    {['Libertário de Direita', 'Autoritário de Direita', 'Libertário de Esquerda', 'Autoritário de Esquerda', 'Centro', 'Centro-Esquerda', 'Centro-Direita', 'Centro-Autoritário', 'Centro-Libertário', 'Autoritário de Centro', 'Libertário de Centro', 'Direita de Centro', 'Esquerda de Centro'].map(quad => {
                      const filtered = leaders.filter(l => l.quadrant === quad);
                      if (filtered.length === 0) return null;
                      
                      const colors: Record<string, string> = {
                        'Libertário de Direita': 'bg-blue-100 border-blue-600 text-blue-900',
                        'Autoritário de Direita': 'bg-red-100 border-red-600 text-red-900',
                        'Libertário de Esquerda': 'bg-emerald-100 border-emerald-600 text-emerald-900',
                        'Autoritário de Esquerda': 'bg-amber-100 border-amber-600 text-amber-900',
                        'Centro': 'bg-gray-100 border-gray-500 text-gray-800',
                        'Centro-Esquerda': 'bg-teal-50 border-teal-500 text-teal-900',
                        'Centro-Direita': 'bg-orange-50 border-orange-400 text-orange-900',
                        'Centro-Autoritário': 'bg-purple-100 border-purple-400 text-purple-900',
                        'Centro-Libertário': 'bg-cyan-100 border-cyan-400 text-cyan-900',
                        'Autoritário de Centro': 'bg-purple-200 border-purple-700 text-purple-950',
                        'Libertário de Centro': 'bg-cyan-200 border-cyan-600 text-cyan-950',
                        'Direita de Centro': 'bg-orange-200 border-orange-600 text-orange-950',
                        'Esquerda de Centro': 'bg-teal-200 border-teal-600 text-teal-950'
                      };
                      
                      return (
                        <div key={quad} className={`p-4 rounded-lg ${colors[quad]}`}>
                          <h4 className="font-semibold mb-3">{quad}</h4>
                          {filtered.map((leader, idx) => (
                            <div key={idx} className="mt-2 border-l-4 border-current pl-3 opacity-90">
                              <p className="font-semibold text-sm">{leader.name}</p>
                              <p className="text-xs text-gray-700">{leader.desc}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6">
                <button onClick={() => {setStep('intro'); setCurrentClusterIndex(0); setAnswers({}); setResult(null); setUserName('');}} className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition">Fazer Novo Teste</button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                <strong>Disclaimer:</strong> Este teste tem caráter exclusivamente lúdico e educacional. Não possui viés político, validação científica, nem representa a opinião do desenvolvedor. O posicionamento das personalidades e o algoritmo foram elaborados com auxílio de IA para fins ilustrativos. <strong>Contato:</strong> <a href="mailto:app.bussola.politica@gmail.com" className="text-indigo-600 hover:text-indigo-800 underline">app.bussola.politica@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PoliticalCompassTest;