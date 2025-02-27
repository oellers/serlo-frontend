Feature('Learners')

const subjectQuickbarSelector = 'input[placeholder*="heute lerne ich"]'

interface LandingPageData {
  iconSelector: string
  headingText: string
  taxRootName: string
  quickbarKeyword: string
  quickbarKeywordResult: string
  quickbarDistractor: string
  quickbarDistractorDontSee: string
  taxonomy1: string
  taxonomyEntry1: string
  taxonomy2: string
  taxonomyEntry2: string
}

async function testLandingPage(I: CodeceptJS.I, data: LandingPageData) {
  I.amOnPage('/')

  // Use icon
  I.click(data.iconSelector)

  I.waitForText(data.headingText, 5)

  // Visit taxonomy
  I.click('Alle Themen')
  I.waitForElement('$breadcrumbs', 15) // page load is quite slow
  I.click(data.taxRootName, locate('$breadcrumbs').withChild('a'))

  // Check correct filter
  I.click(subjectQuickbarSelector)
  I.type(data.quickbarKeyword)
  I.see(data.quickbarKeywordResult, 'div.shadow')

  // Clear input
  I.pressKey('Escape')
  I.click(subjectQuickbarSelector)

  I.type(data.quickbarDistractor)
  I.dontSee(data.quickbarDistractorDontSee, 'div.shadow')

  // Close quickbar
  I.refreshPage()

  // Taxonomy explorer
  I.dontSee(data.taxonomyEntry1, 'li > a.serlo-link')
  I.click(data.taxonomy1)
  I.see(data.taxonomyEntry1, 'li > a.serlo-link')
  I.dontSee(data.taxonomyEntry2, 'li > a.serlo-link')
  I.click(data.taxonomy2)
  I.see(data.taxonomyEntry2, 'li > a.serlo-link')

  // Mitmachen
  I.click('Mitmachen', '.bg-blueWave')
  I.see('Werde Teil der Serlo Community')
}

const landingPages: LandingPageData[] = [
  {
    iconSelector: 'svg.superspecial-math',
    headingText: 'Keine Angst vor Zahlen',
    taxRootName: 'Mathematik',
    quickbarKeyword: 'vektor',
    quickbarKeywordResult: 'Vektorbegriff',
    quickbarDistractor: 'zelle',
    quickbarDistractorDontSee: 'Brennstoffzelle',
    taxonomy1: 'Zahlen & Größen',
    taxonomyEntry1: 'Grundrechenarten',
    taxonomy2: 'Stochastik',
    taxonomyEntry2: 'Kombinatorik',
  },
  {
    iconSelector: 'svg.superspecial-sus',
    headingText: 'Unsere Welt gibt es nur einmal',
    taxRootName: 'Angewandte Nachhaltigkeit',
    quickbarKeyword: 'umwelt',
    quickbarKeywordResult: 'Umweltschutz',
    quickbarDistractor: 'zelle',
    quickbarDistractorDontSee: 'Brennstoffzelle',
    taxonomy1: 'Plastik',
    taxonomyEntry1: 'Leben ohne Plastik?',
    taxonomy2: 'Klimaschutz aktiv leben',
    taxonomyEntry2: 'Klimawandel',
  },
  {
    iconSelector: 'svg.superspecial-bio',
    headingText: 'Gib deinem Hirn einen Evolutionssprung',
    taxRootName: 'Biologie',
    quickbarKeyword: 'zelle',
    quickbarKeywordResult: 'Tierische Zelle',
    quickbarDistractor: 'zelle',
    quickbarDistractorDontSee: 'Brennstoffzelle',
    taxonomy1: 'Ökologie',
    taxonomyEntry1: 'Populationsdynamik',
    taxonomy2: 'Vielfalt der Lebewesen',
    taxonomyEntry2: 'Wirbellose Tiere',
  },
  {
    iconSelector: 'svg.superspecial-chem',
    headingText: 'In der Chemie ist nicht alles ätzend',
    taxRootName: 'Chemie',
    quickbarKeyword: 'chemie',
    quickbarKeywordResult: 'Chemie',
    quickbarDistractor: 'zelle',
    quickbarDistractorDontSee: 'Tierische Zelle',
    taxonomy1: 'Grundlagen',
    taxonomyEntry1: 'Was ist Chemie?',
    taxonomy2: 'Stoffmenge',
    taxonomyEntry2: 'Stoffmenge und Mol',
  },
  {
    iconSelector: 'svg.superspecial-informatics',
    headingText: 'Keine Angst vor Computern',
    taxRootName: 'Informatik',
    quickbarKeyword: 'bin',
    quickbarKeywordResult: 'Binärsystem',
    quickbarDistractor: 'zelle',
    quickbarDistractorDontSee: 'Tierische Zelle',
    taxonomy1: 'Daten & Informationen',
    taxonomyEntry1: 'Verarbeitung von Informationen',
    taxonomy2: 'Theoretische Informatik',
    taxonomyEntry2: 'Formale Sprachen',
  },
]

Scenario('Subject landing page', ({ I }) => {
  testLandingPage(I, landingPages[3])
})

Scenario('Geogebra', ({ I }) => {
  I.amOnPage(
    '/mathe/44647/43563/applet-flaechenberechnung-in-abhaengigkeit-von-x'
  )
  I.click('Applet laden von GeoGebra')
  I.waitForElement('canvas[data-test="euclidianView"]', 10)

  I.amOnPage('/')

  I.amOnPage('/279849')
  I.click('Applet laden von GeoGebra')
  I.waitForElement('canvas[data-test="euclidianView"]', 10)
})

Scenario('Video + Injection', ({ I }) => {
  I.amOnPage('/277232')
  I.scrollTo('#f7f13990')
  I.see('dass externe Inhalte von')
  I.click('Video abspielen von YouTube')
  I.switchTo('iframe')
  I.seeElement('video')
})

Scenario('Toggle Solution', ({ I }) => {
  I.amOnPage('/37779')
  I.see('Die Klasse 8a')
  I.dontSee('Für diese Aufgabe benötigst Du')
  I.click('Lösung')
  I.see('Für diese Aufgabe benötigst Du')
  I.click('Lösung')
  I.dontSee('Für diese Aufgabe benötigst Du')
})

Scenario('Taxonomy', ({ I }) => {
  // Math all topics
  I.amOnPage('/5')
  I.see('Zahlen und Größen')
  I.see('Bereiche')
  I.see('Grundrechenarten')

  // Meta nav
  I.click('Realschule')

  // Running around a bit more
  I.see('Klasse 5')
  I.see('Klasse 6')
  I.click('Klasse 7')
  I.see('Klasse 7')
  I.click('Grundwissenstest 7. Klasse')
  I.see('Aufgaben')
  I.click('2021')

  // Takes a long time to load
  I.see('Berechne')

  I.amOnPage('/24370')
  I.see('Artikel')
  I.see('Videos')
  I.see('Applets')
  I.see('Aufgaben')
})

Scenario('Breadcrumbs', ({ I }) => {
  // Check entries
  I.amOnPage('/247918')
  I.see('Mathematik', 'a.hidden')
  I.see('Realschule', 'a.hidden')
  I.see('Klasse 7', 'a.hidden')
  I.see('Grundwissenstest 7. Klasse', 'a.serlo-button')

  // Is short-circuit
  I.dontSee('Deutschland')

  // Nav
  I.click('Realschule')
  I.see('Dieser Bereich orientiert sich')

  // Another test
  I.amOnPage('/35149')
  I.see('Angewandte Nachhaltigkeit', 'a.hidden')
  I.see('Was bedeutet Nachhaltigkeit?', 'a.hidden')
  I.see('Grundlagen der Nachhaltigkeit', 'a.serlo-button')

  // Check description
  I.click('Grundlagen der Nachhaltigkeit')
  I.seeElement('img.serlo-img')

  // Check if right taxonomy is selected
  I.amOnPage('/1555')
  I.see('Wichtige Grundkörper', 'a.serlo-button')
  I.dontSee('Realschule')
  I.dontSee('Gymnasium')
})

Scenario('Small subject', ({ I }) => {
  I.amOnPage('/politik')
  I.click('Alle Themen')

  // Meta mneu
  I.see('Alle Themen', 'a.block')

  // Breadcrumbs
  I.click('Politik')
  I.see('Politik Startseite', 'h1')
})

// This is not a good way of accessing language versions because it's testing production
// Find another way if suitable
/* Scenario('Subject on language version', ({ I }) => {
  I.amOnPage('/')
  I.click('Serlo in anderen Sprachen')
  I.click('Español')
  I.click('Diásporas Africanas')
  I.click('Todos los temas')

  // All topics
  I.see('Construimos una plataforma')

  I.click('Estudios en Diásporas Africanas para la Escuela')
  I.see('¡Bienvenidos a la')
})*/

Scenario('Course', ({ I }) => {
  I.amOnPage('/1327')
  I.see('Kurse')
  I.click('Einführung lineare Funktionen')
  I.see('1', 'span.rounded-full')
  I.see('Kursübersicht', 'h1')
  I.see('Einführung lineare Funktionen')
  I.click('Weiter')
  I.see('2', 'span.rounded-full')
  I.see('Aufstieg zur Zugspitze', 'h1')
  I.click('Zurück')
  I.see('Kursübersicht', 'h1')
  I.click('Kursübersicht')
  I.see('Zusammenfassung')
  I.click('Weiterführende Übungen')
  I.see('Lösungsvorschlag')
})

Scenario('Comments', ({ I }) => {
  // End of entity
  I.amOnPage('/1537')
  I.scrollTo('#comment-area-begin-scrollpoint')
  I.see('Hast du eine Frage oder Feedback?')
  I.see('Der Artikel Koordinatesystem ist nicht')

  // In exercise
  I.amOnPage('/37296')
  I.click('Lösung')
  I.scrollTo('#comment-area-begin-scrollpoint')
  I.see('Ich weiß nicht, ob es vom Computer')
})
