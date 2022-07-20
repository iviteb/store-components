import React, { memo } from 'react'
import type { CssHandlesTypes } from 'vtex.css-handles'

import AdvancedNotificationBar from './components/AdvancedNotificationBar'

const CSS_HANDLES = [
  'notificationBarContainer',
  'notificationBarInner',
  'notificationContent',
] as const

interface Props {
  /** Text to be used in the bar */
  content?: string
  color?: string
  link?: string
  linkText?: string
  icon?: string
  notifBarIdx?: number
  categoryID?: number
  sellerID?: number
  blockClass?: string
  /** Used to override default CSS handles */
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function NotificationBar({
  content = '',
  color = '',
  link = '',
  linkText = '',
  icon = '',
  notifBarIdx,
  categoryID,
  sellerID,
  blockClass,
  classes,
}: Props) {
  if (!content) {
    return null
  }

  return (
    <AdvancedNotificationBar
      content={content}
      color={color}
      link={link}
      linkText={linkText}
      icon={icon}
      notifBarIdx={notifBarIdx}
      categoryID={categoryID}
      sellerID={sellerID}
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
