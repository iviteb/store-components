import React, { memo } from 'react'
import { useIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'
import { useCssHandles } from 'vtex.css-handles'
import type { CssHandlesTypes } from 'vtex.css-handles'

import { SanitizedHTML } from './components/SanitizedHTML'
import AdvancedNotificationBar from './components/AdvancedNotificationBar'

const CSS_HANDLES = [
  'notificationBarContainer',
  'notificationBarInner',
  'notificationContent',
] as const

interface Props {
  /** Text to be used in the bar */
  isAdvanced?: boolean
  content?: string
  color?: string
  link?: string
  linkText?: string
  icon?: string
  notifBarIdx?: number
  blockClass?: string
  /** Used to override default CSS handles */
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function NotificationBar({
  isAdvanced,
  content = '',
  color = '',
  link = '',
  linkText = '',
  icon = '',
  notifBarIdx,
  blockClass,
  classes,
}: Props) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const intl = useIntl()

  if (!content) {
    return null
  }

  return !isAdvanced ? (
    <div
      className={`${handles.notificationBarContainer} bg-base--inverted c-on-base--inverted w-100`}
    >
      <div
        className={`${handles.notificationBarInner} min-h-large flex items-center justify-center`}
      >
        <div className={handles.notificationContent}>
          <SanitizedHTML
            content={formatIOMessage({ id: content, intl }) as string}
          />
        </div>
      </div>
    </div>
  ) : (
    <AdvancedNotificationBar
      content={content}
      color={color}
      link={link}
      linkText={linkText}
      icon={icon}
      notifBarIdx={notifBarIdx}
      blockClass={blockClass}
      classes={classes}
    />
  )
}

const MemoizedNotificationBar: React.MemoExoticComponent<
  typeof NotificationBar
> & { schema?: Record<string, string> } = memo(NotificationBar)

MemoizedNotificationBar.schema = {
  title: 'admin/editor.notification-bar.title',
}

export default MemoizedNotificationBar
