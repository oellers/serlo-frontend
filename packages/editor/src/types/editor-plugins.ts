import type { PrettyStaticState } from '@editor/plugin'
import type { AnchorPluginState } from '@editor/plugins/anchor'
import type { ArticlePluginState } from '@editor/plugins/article'
import { AudioPluginState } from '@editor/plugins/audio'
import { BlanksExerciseState } from '@editor/plugins/blanks-exercise'
import { BoxPluginState } from '@editor/plugins/box'
import { CoursePluginState } from '@editor/plugins/course'
import { DropzoneImagePluginState } from '@editor/plugins/dropzone-image'
import { EquationsPluginState } from '@editor/plugins/equations'
import type { ExercisePluginState } from '@editor/plugins/exercise'
import { ExerciseGroupPluginState } from '@editor/plugins/exercise-group'
import type { GeogebraPluginState } from '@editor/plugins/geogebra'
import type { HighlightPluginState } from '@editor/plugins/highlight'
import type { ImagePluginState } from '@editor/plugins/image'
import type { InjectionPluginState } from '@editor/plugins/injection'
import type { InputExercisePluginState } from '@editor/plugins/input-exercise'
import type { MultimediaPluginState } from '@editor/plugins/multimedia'
import { PageLayoutPluginState } from '@editor/plugins/page-layout'
import { PagePartnersPluginState } from '@editor/plugins/page-partners'
import { PageTeamPluginState } from '@editor/plugins/page-team'
import type { RowsPluginState } from '@editor/plugins/rows'
import type { ScMcExercisePluginState } from '@editor/plugins/sc-mc-exercise'
import { SerloTablePluginState } from '@editor/plugins/serlo-table'
import { TextExerciseGroupTypePluginState } from '@editor/plugins/serlo-template-plugins/exercise-group/text-exercise-group'
import { GenericContentTypePluginState } from '@editor/plugins/serlo-template-plugins/generic-content'
import type { SolutionPluginState } from '@editor/plugins/solution'
import { SpoilerPluginState } from '@editor/plugins/spoiler'
import type {
  TextEditorState,
  CustomElement,
  CustomText,
} from '@editor/plugins/text'
import { TextAreaExercisePluginState } from '@editor/plugins/text-area-exercise'
import type { UnsupportedPluginState } from '@editor/plugins/unsupported'
import type { VideoPluginState } from '@editor/plugins/video'

import { EditorPluginType } from './editor-plugin-type'
import { TemplatePluginType } from './template-plugin-type'

export type SlateBlockElement = CustomElement
export type SlateTextElement = CustomText

// All supported editor plugins in their static versions

export interface EditorAnchorDocument {
  plugin: EditorPluginType.Anchor
  state: PrettyStaticState<AnchorPluginState>
  id?: string
}
export interface EditorArticleDocument {
  plugin: EditorPluginType.Article
  state: PrettyStaticState<ArticlePluginState>
  id?: string
  serloContext?: {
    articleTitle?: string
  }
}
export interface EditorArticleIntroductionDocument {
  plugin: EditorPluginType.ArticleIntroduction
  state: PrettyStaticState<MultimediaPluginState>
  id?: string
}
export interface EditorBoxDocument {
  plugin: EditorPluginType.Box
  state: PrettyStaticState<BoxPluginState>
  id?: string
}
export interface EditorCourseDocument {
  plugin: EditorPluginType.Course
  state: PrettyStaticState<CoursePluginState>
  id?: string
  // additional data for serlo, not part of normal state
  serloContext?: {
    activeCoursePageId?: string
    courseTitle: string
    coursePageUrls: string[]
  }
}
export interface EditorUnsupportedDocument {
  plugin: EditorPluginType.Unsupported
  state: PrettyStaticState<UnsupportedPluginState>
  id?: string
}
export interface EditorEquationsDocument {
  plugin: EditorPluginType.Equations
  state: PrettyStaticState<EquationsPluginState>
  id?: string
}
export interface EditorExerciseDocument {
  plugin: EditorPluginType.Exercise
  state: PrettyStaticState<ExercisePluginState>
  id?: string

  // additional data for serlo, not part of normal state
  serloContext?: {
    uuid?: number
    revisionId?: number
    trashed?: boolean
    grouped?: boolean
    unrevisedRevisions?: number
    licenseId?: number
  }
}
export interface EditorGeogebraDocument {
  plugin: EditorPluginType.Geogebra
  state: PrettyStaticState<GeogebraPluginState>
  id?: string
}
export interface EditorHighlightDocument {
  plugin: EditorPluginType.Highlight
  state: PrettyStaticState<HighlightPluginState>
  id?: string
}
export interface EditorImageDocument {
  plugin: EditorPluginType.Image
  state: PrettyStaticState<ImagePluginState>
  id?: string
}
export interface EditorInjectionDocument {
  plugin: EditorPluginType.Injection
  state: PrettyStaticState<InjectionPluginState>
  id?: string
}
export interface EditorInputExerciseDocument {
  plugin: EditorPluginType.InputExercise
  state: PrettyStaticState<InputExercisePluginState>
  id?: string
}
export interface EditorTextAreaExerciseDocument {
  plugin: EditorPluginType.TextAreaExercise
  state: PrettyStaticState<TextAreaExercisePluginState>
  id?: string
}
export interface EditorMultimediaDocument {
  plugin: EditorPluginType.Multimedia
  state: PrettyStaticState<MultimediaPluginState>
  id?: string
}
export interface EditorRowsDocument {
  plugin: EditorPluginType.Rows
  state: PrettyStaticState<RowsPluginState>
  id?: string
}
export interface EditorScMcExerciseDocument {
  plugin: EditorPluginType.ScMcExercise
  state: PrettyStaticState<ScMcExercisePluginState>
  id?: string
}
export interface EditorBlanksExerciseDocument {
  plugin: EditorPluginType.BlanksExercise
  state: PrettyStaticState<BlanksExerciseState>
  id?: string
}
export interface EditorDropzoneImageDocument {
  plugin: EditorPluginType.DropzoneImage
  state: PrettyStaticState<DropzoneImagePluginState>
  id?: string
}
export interface EditorSpoilerDocument {
  plugin: EditorPluginType.Spoiler
  state: PrettyStaticState<SpoilerPluginState>
  id?: string
}
export interface EditorSerloInjectionDocument {
  plugin: EditorPluginType.Injection
  state: PrettyStaticState<InjectionPluginState>
  id?: string
}
export interface EditorSolutionDocument {
  plugin: EditorPluginType.Solution
  state: PrettyStaticState<SolutionPluginState>
  id?: string

  // additional data for serlo, not part of normal state
  serloContext?: {
    uuid?: number
    exerciseId?: number
    trashed?: boolean
    unrevisedRevisions?: number
    licenseId?: number
  }
}
export interface EditorSerloTableDocument {
  plugin: EditorPluginType.SerloTable
  state: PrettyStaticState<SerloTablePluginState>
  id?: string
}
export interface EditorTextDocument {
  plugin: EditorPluginType.Text
  state: PrettyStaticState<TextEditorState>
  id?: string
}
export interface EditorVideoDocument {
  plugin: EditorPluginType.Video
  state: PrettyStaticState<VideoPluginState>
  id?: string
}
export interface EditorAudioDocument {
  plugin: EditorPluginType.Audio
  state: PrettyStaticState<AudioPluginState>
  id?: string
}
export interface EditorPageLayoutDocument {
  plugin: EditorPluginType.PageLayout
  state: PrettyStaticState<PageLayoutPluginState>
  id?: string
}
export interface EditorPageTeamDocument {
  plugin: EditorPluginType.PageTeam
  state: PrettyStaticState<PageTeamPluginState>
  id?: string
}
export interface EditorPagePartnersDocument {
  plugin: EditorPluginType.PagePartners
  state: PrettyStaticState<PagePartnersPluginState>
  id?: string
}

export interface EditorExerciseGroupDocument {
  plugin: EditorPluginType.ExerciseGroup
  state: Omit<PrettyStaticState<ExerciseGroupPluginState>, 'exercises'> & {
    exercises: EditorExerciseDocument[]
  }
  id?: string

  // additional data for serlo, not part of normal state
  serloContext?: {
    uuid?: number
    revisionId?: number
    trashed?: boolean
    unrevisedRevisions?: number
    licenseId?: number
  }
}

// Template Plugins
export interface EditorTemplateExerciseGroupDocument {
  plugin: TemplatePluginType.TextExerciseGroup
  state: PrettyStaticState<TextExerciseGroupTypePluginState> & {
    content: EditorExerciseGroupDocument
  }
  id?: string
}
export interface EditorTemplateGenericContentDocument {
  plugin: TemplatePluginType.GenericContent
  state: PrettyStaticState<GenericContentTypePluginState>
  id?: string
}

export type SupportedEditorDocument =
  | EditorArticleDocument
  | EditorArticleIntroductionDocument
  | EditorGeogebraDocument
  | EditorAnchorDocument
  | EditorVideoDocument
  | EditorAudioDocument
  | EditorSerloTableDocument
  | EditorHighlightDocument
  | EditorSerloInjectionDocument
  | EditorMultimediaDocument
  | EditorSpoilerDocument
  | EditorBoxDocument
  | EditorImageDocument
  | EditorTextDocument
  | EditorRowsDocument
  | EditorEquationsDocument
  | EditorExerciseDocument
  | EditorPageLayoutDocument
  | EditorPageTeamDocument
  | EditorPagePartnersDocument

export interface UnknownEditorDocument {
  plugin: string
  state?: unknown
  id?: string
}

export type AnyEditorDocument = SupportedEditorDocument | UnknownEditorDocument
