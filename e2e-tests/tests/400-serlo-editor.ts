import { addNewTextPlugin } from './helpers/add-plugin'
import { popupWarningFix } from './helpers/popup-warning-fix'

Feature('Serlo Editor')

Before(popupWarningFix)

Scenario('Basic text interactions', async ({ I }) => {
  I.amOnPage('/entity/repository/add-revision/74888')

  addNewTextPlugin(I)

  const testString = 'TESTTESTTEST'
  I.type(testString)
  I.see(testString)
  for (let i = 0; i < testString.length; i++) {
    I.pressKey('Backspace')
  }
  I.dontSee(testString)
})

Scenario('Add new plugins', async ({ I }) => {
  I.amOnPage('/entity/create/Article/1377')

  // Spoiler
  I.say('I insert a text plugin')
  I.click('$add-new-plugin-row-button')
  I.type('Text')
  I.pressKey('Tab')
  I.pressKey('Enter')

  // Only one text plugin visible
  I.see('Schreibe etwas')

  // workaround: plugin toolbar is hiding add-new-plugin-row-button
  // unfocus to make it visible
  I.click('$entity-title-input')

  // Spoiler
  I.say('I insert a spoiler plugin')
  I.click('$add-new-plugin-row-button')
  I.type('Spoiler')
  I.pressKey('Tab')
  I.pressKey('Enter')

  I.see('Titel eingeben')

  // Box
  I.say('I insert a box plugin')
  I.click('$add-new-plugin-row-button')
  I.type('Box')
  I.pressKey('Tab')
  I.pressKey('Enter')

  I.see('Art der Box')
  I.click('Merke')

  I.see('(optionaler Titel)')
})

Scenario('Close plugin selection modal', async ({ I }) => {
  I.amOnPage('/entity/create/Article/1377')
  I.click('Füge ein Element hinzu')
  const menuModal = 'Exercises'
  I.see(menuModal)

  I.pressKey('Escape')
  // Modal should be closed
  I.dontSee(menuModal)
})

Scenario('Add plugin via slash command', async ({ I }) => {
  I.amOnPage('/entity/create/Article/1377')

  // ensure there is no table yet
  I.dontSeeElement('.serlo-table')
  I.click('$add-new-plugin-row-button')
  I.type('Tabelle')
  I.pressKey('Tab')
  I.pressKey('Enter')

  I.seeElement('.serlo-table')
})

Scenario(
  'Feature compatibility: "suggestions" and "empty lines restriction"',
  ({ I }) => {
    I.amOnPage('/entity/create/Article/1377')

    I.say(
      'Add a Text plugin with two paragraphs and an empty line between them'
    )
    I.click(locate('$plugin-text-editor').inside('.plugin-rows'))
    I.type('First paragraph')
    I.pressKey('Enter')
    I.pressKey('Enter')
    I.type('Second paragraph')

    I.say('Add an Image plugin in place of the empty line using suggestions')
    I.pressKey('ArrowUp')
    I.type('/')
    I.type('Bild')
    I.pressKey('Tab')
    I.pressKey('Enter')

    I.see('First paragraph')
    I.seeElement('$plugin-image-editor')
    I.see('Second paragraph')

    I.say('Remove the Image plugin and merge the split Text plugin')
    I.moveCursorTo(
      locate('[data-radix-collection-item]').inside('.plugin-toolbar')
    )
    I.click('$remove-plugin-button')
    I.click(locate('$plugin-text-editor').inside('.plugin-rows'))
    I.pressKey('Delete')

    I.say(
      'Add two empty lines between the paragraphs, and then add an Image plugin in place of the first empty line using suggestions'
    )
    I.pressKey('Enter')
    I.pressKey('Enter')
    I.pressKey('ArrowUp')
    I.type('/')
    I.type('Bild')
    I.pressKey('Tab')
    I.pressKey('Enter')

    I.see('First paragraph')
    I.seeElement('$plugin-image-editor')
    I.see('Second paragraph')
  }
)

/**
 * Most of the input of the editor happens within the editor contenteditable
 * div. However, there are some input fields whose undo/redo behavior could
 * function differently because we have one global undo/redo handler and the
 * browser also natively handles it unless we specifically overwrite the behavior.
 * Therefore, we want to ensure that we never do 2 undos when ctrl+z is pressed.
 */
Scenario(
  'Undo via keyboard in input field for article heading',
  async ({ I }) => {
    I.amOnPage('/entity/create/Article/1377')

    const articleHeadingInput = '$entity-title-input'
    I.click(articleHeadingInput)

    const firstWord = 'Some '
    I.type(firstWord)
    I.wait(2)

    const secondWord = 'Text'
    I.type(secondWord)

    I.seeInField(articleHeadingInput, `${firstWord}${secondWord}`)

    I.pressKey(['CommandOrControl', 'Z'])
    I.dontSeeInField(articleHeadingInput, `${firstWord}${secondWord}`)
    I.dontSeeInField(articleHeadingInput, `${secondWord}`)
    I.seeInField(articleHeadingInput, firstWord)

    I.pressKey(['CommandOrControl', 'Z'])
    I.dontSeeInField(articleHeadingInput, `${firstWord}${secondWord}`)
    I.dontSeeInField(articleHeadingInput, firstWord)
  }
)

Scenario(
  'Undo via keyboard in input field of picture plugin',
  async ({ I }) => {
    // make sure autofocus logic after opening is done
    I.wait(0.5)
    // No need to create the image plugin first as the multimedia plugin at the
    // beginning of each page already contains one. But, we do need to focus it,
    // in order to make the src input visible
    I.click('$plugin-image-editor')
    I.click('$modal-close-button') // patch to close the pixabay modal

    const imagePluginUrlInput =
      'input[placeholder="https://example.com/image.png"]'

    I.click(imagePluginUrlInput)

    const firstWord = 'Some '
    I.type(firstWord)
    I.wait(2)

    const secondWord = 'Text'
    I.type(secondWord)

    I.seeInField(imagePluginUrlInput, `${firstWord}${secondWord}`)

    I.pressKey(['CommandOrControl', 'Z'])
    I.dontSeeInField(imagePluginUrlInput, `${firstWord}${secondWord}`)
    I.dontSeeInField(imagePluginUrlInput, `${secondWord}`)
    I.seeInField(imagePluginUrlInput, firstWord)

    I.pressKey(['CommandOrControl', 'Z'])
    I.dontSeeInField(imagePluginUrlInput, `${firstWord}${secondWord}`)
    I.dontSeeInField(imagePluginUrlInput, firstWord)
  }
)

Scenario(
  'Redo in input field for article heading via keyboard',
  async ({ I }) => {
    I.amOnPage('/entity/create/Article/1377')

    const articleHeadingInput = '$entity-title-input'
    I.click(articleHeadingInput)

    const firstWord = 'Some '
    I.type(firstWord)
    I.wait(2)

    const secondWord = 'Text'
    I.type(secondWord)
    I.seeInField(articleHeadingInput, `${firstWord}${secondWord}`)

    I.pressKey(['CommandOrControl', 'Z'])
    I.dontSeeInField(articleHeadingInput, `${firstWord}${secondWord}`)
    I.dontSeeInField(articleHeadingInput, `${secondWord}`)
    I.seeInField(articleHeadingInput, firstWord)

    I.pressKey(['CommandOrControl', 'Y'])
    I.seeInField(articleHeadingInput, `${firstWord}${secondWord}`)
  }
)
