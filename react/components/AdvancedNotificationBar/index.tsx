import React, { memo, useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type { CssHandlesTypes } from 'vtex.css-handles'
import { Link } from 'vtex.render-runtime'

import AnnounceClose from './icons/AnnounceClose'
import AnnounceRight from './icons/AnnounceRight'
import AnnounceInfo from './icons/AnnounceInfo'

const CSS_HANDLES = [
  'notificationBarContainer',
  'notificationImageContainer',
  'notificationImage',
  'notificationBarInner',
  'notificationContent',
  'notificationText',
  'notificationCloseButton',
  'notificationLink',
  'notificationLinkText',
  'notificationBarIcon',
  'notificationCloseIcon',
  'notificationArrowRight',
] as const

interface Props {
  content?: string
  color?: string
  link?: string
  linkText?: string
  icon?: string
  notifBarIdx?: number
  blockClass?: string
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function AdvancedNotificationBar({
  content,
  color,
  link,
  linkText,
  icon,
  notifBarIdx,
  blockClass,
  classes,
}: Props) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const [show, setShow] = useState(false)

  const handleClose = () => {
    sessionStorage.setItem(
      `closeNotificationBar-${notifBarIdx?.toString()}`,
      'true'
    )
    setShow(false)
  }

  useEffect(() => {
    if (
      !sessionStorage.getItem(`closeNotificationBar-${notifBarIdx?.toString()}`)
    ) {
      setShow(true)
    }
  }, [notifBarIdx])

  if (!content) {
    return null
  }

  let background = ''
  let iconBackground = ''
  let secondaryTheme = false // for ex the yellow bar has brown icons and text
  let fill = '#fff'

  switch (color) {
    case 'Dark Blue':
      background = '#143D5F'
      iconBackground = 'rgba(255, 255, 255, 0.1)'
      break

    case 'Green':
      background = '#00AC6C'
      iconBackground = 'rgba(0, 123, 77, 0.4)'
      break

    case 'Red':
      background = '#ED002E'
      iconBackground = '#D40029'
      break

    case 'Light Blue':
      background = '#29A7CD'
      iconBackground = '#1993B8'
      break

    case 'Yellow':
      background = '#FFDE80'
      iconBackground = 'rgba(204, 151, 0, 0.3)'
      fill = '#775800'
      secondaryTheme = true
      break

    default:
      background = '#143D5F'
      iconBackground = 'rgba(255, 255, 255, 0.1)'
      break
  }

  const textColor = secondaryTheme ? '#775800' : '#fff'

  if (!show) {
    return null
  }

  return (
    <div
      className={`${handles.notificationBarContainer}${blockClass && `--${blockClass}`
        } relative w-100 pv5`}
      style={{ backgroundColor: background }}
    >
      <div
        style={{
          backgroundColor: iconBackground,
          borderRadius: '0px 100px 100px 0px',
        }}
        className={`${handles.notificationImageContainer} absolute left-0 pa3`}
      >
        {icon !== '' ? (
          <img
            src={icon}
            alt="barIcon"
            width={24}
            className={`${handles.notificationImage} mr2 mt2`}
          />
        ) : (
          <AnnounceInfo
            fill={fill}
            styleClass={handles.notificationBarIcon}
            size="30"
            viewBox="0 0 24 18"
          />
        )}
      </div>

      <div
        className={`${handles.notificationBarInner} min-h-large flex flex-column pl9 pr5 justify-around`}
      >
        <div className={`${handles.notificationContent} flex justify-between`}>
          <p
            style={{ color: textColor }}
            className={`${handles.notificationText} link f6 fw4 lh-solid tl ma0 w-90 mb3`}
          >
            {content !== '' ? content : 'Announcement bar text content'}
          </p>
          <button
            onClick={() => handleClose()}
            className={`${handles.notificationCloseButton} bg-transparent bn pointer flex mb3`}
          >
            <AnnounceClose
              fill={fill}
              styleClass={handles.notificationCloseIcon}
            />
          </button>
        </div>

        <Link
          to={link}
          style={{ width: 'fit-content' }}
          className={`${handles.notificationLink} flex items-center`}
        >
          <p
            style={{ color: textColor }}
            className={`${handles.notificationLinkText} f7 b lh-solid tl underline ttu ma0`}
          >
            {linkText !== '' ? linkText : 'Link text'}
          </p>
          <AnnounceRight
            fill={fill}
            styleClass={handles.notificationArrowRight}
          />
        </Link>
      </div>
    </div>
  )
}

const MemoizedAdvNotificationBar: React.MemoExoticComponent<
  typeof AdvancedNotificationBar
> & { schema?: Record<string, string> } = memo(AdvancedNotificationBar)

MemoizedAdvNotificationBar.schema = {
  title: 'admin/editor.notification-bar.title',
}

export default MemoizedAdvNotificationBar
