Feature('Serlo Editor - focus behaviour')

Scenario('Autofocus', async ({ I }) => {
  I.amOnPage('/entity/create/Course/1377')
  I.say('focused on title in new course')
  I.seeElement('h1 > input:focus')

  I.amOnPage('/entity/repository/add-revision/277232')
  I.say('focused on title in existing article')
  I.seeElement('h1 > input:focus')

  I.amOnPage('/entity/create/Article/1377')
  I.say('focused on title in new article')
  I.seeElement('h1 > input:focus')

  I.click('Füge ein Element hinzu')
  I.type('Bild')
  I.pressKey('Tab')
  I.pressKey('Enter')
  I.say('focused on src input field of newly added image plugin')
  I.seeElement(locate('input[data-qa="plugin-image-src"]:focus'))
})

Scenario.todo('add test for exercises autofocus') // after exercise refactoring

Scenario('focus plugins by clicking', async ({ I }) => {
  I.amOnPage('/entity/repository/add-revision/5')

  I.say('focus the existing text plugin and change it to an image plugin')
  I.click('$plugin-text-editor')
  I.see('Text', '$plugin-type-indicator')
  I.type('/')
  I.click('$plugin-suggestion-image')
  I.see('Bild', '$plugin-type-indicator')
  I.say('focused on src input field of new image plugin')
  I.seeElement('input[data-qa="plugin-image-src"]:focus')

  I.say('type in the image src (caption input not available otherwise)')
  const src = 'https://de.serlo.org/_assets/img/serlo-logo.svg'
  I.type(src)
  I.seeElement(locate('img.serlo-img').withAttr({ src }))

  I.say('image plugin still focused after clicking on its caption')
  I.click(locate('$plugin-text-editor').inside('$plugin-image-editor'))
  I.see('Bild', '$plugin-type-indicator')

  I.say('add a new plugin')
  I.click('Füge ein Element hinzu', undefined, { force: true })
  I.type('Text')
  I.pressKey('Tab')
  I.pressKey('Enter')
  I.say('not focused on the image plugin anymore')
  I.say('focused on the new text plugin instead of the image plugin')
  I.see('Text', '$plugin-type-indicator')

  I.dontSeeElement('h5')

  I.say('click outside of editor again to unfocus the plugin')
  I.click('header')
  I.dontSeeElement('.plugin-toolbar')
})

Scenario('focus plugins with tab key', async ({ I }) => {
  I.amOnPage('/entity/create/Article/1377')
  I.waitForElement('h1 > input:focus', 5)

  I.say('focus on image plugin inside of introduction multimedia plugin')
  // TODO: Double tab is a quick fix, focus / toolbar visibility needs to be improved in image ,
  //       specifically with ImageSelectionScreen component
  I.pressKey('Tab')
  I.pressKey('Tab')
  I.see('Bild', '$plugin-type-indicator')
  I.see('Erklärung mit Multimedia-Inhalt', '$plugin-multimedia-parent-button')

  I.say('focus on text plugin inside of introduction multimedia plugin')
  // TODO: Triple tab is a quick fix, its not clear that the tab order is correct for a good UX
  I.pressKey('Tab')
  I.pressKey('Tab')
  I.pressKey('Tab')

  I.see('Text', '$plugin-type-indicator')
  I.see('Erklärung mit Multimedia-Inhalt', '$plugin-multimedia-parent-button')

  I.say('focus on text plugin under introduction multimedia plugin')
  I.pressKey('Tab')
  I.pressKey('Tab')
  I.see('Text', '$plugin-type-indicator')
  I.dontSee('Erklärung mit Multimedia-Inhalt')

  I.type('/injection')
  I.pressKey('Enter')
  I.say('focus back on text plugin inside of introduction multimedia plugin')
  I.pressKey(['Shift', 'Tab'])
  I.pressKey(['Shift', 'Tab'])
  I.see('Text', '$plugin-type-indicator')
  I.see('Erklärung mit Multimedia-Inhalt', '$plugin-multimedia-parent-button')
})

Scenario('focus plugins with arrow keys', ({ I }) => {
  I.amOnPage('/entity/create/Article/1377')

  I.say('add first text plugin, type in it, check that it has focus')
  I.click('Füge ein Element hinzu')
  I.type('Text')
  I.pressKey('Tab')
  I.pressKey('Enter')
  I.type('First text plugin')
  I.see('First text plugin', 'div[data-slate-editor="true"]:focus')

  I.say('add second text plugin, type in it, check that it has focus')
  I.pressKey('Tab')
  I.pressKey('Enter')

  I.type('Text')
  I.pressKey('Tab')
  I.pressKey('Enter')
  I.type('Second text plugin')
  I.see('First text plugin', 'div[data-slate-editor="true"]')
  I.dontSee('First text plugin', 'div[data-slate-editor="true"]:focus')
  I.see('Second text plugin', 'div[data-slate-editor="true"]:focus')

  I.say('move back to first text plugin using arrow up')
  // Set cursor to start of content text, second to focus first text plugin
  I.pressKey(['Ctrl', 'A'])
  I.pressKey('ArrowLeft')
  I.pressKey('ArrowUp')
  I.pressKey('ArrowUp')
  // cursor will be at the beginning of first text plugin (okay for now)
  I.see('Second text plugin', 'div[data-slate-editor="true"]')
  I.dontSee('Second text plugin', 'div[data-slate-editor="true"]:focus')
  I.see('First text plugin', 'div[data-slate-editor="true"]:focus')

  I.say('move down to second text plugin using arrow down')
  // first arrow down to move cursor to end, second to focus second text plugin
  I.pressKey(['Ctrl', 'A'])
  I.pressKey('ArrowRight')
  I.pressKey('ArrowDown')
  I.pressKey('ArrowDown')
  I.see('First text plugin', 'div[data-slate-editor="true"]')
  I.dontSee('First text plugin', 'div[data-slate-editor="true"]:focus')
  I.see('Second text plugin', 'div[data-slate-editor="true"]:focus')
})

Scenario.todo('restores cursor positions')
