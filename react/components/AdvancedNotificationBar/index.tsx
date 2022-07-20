import React, { memo, useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import type { CssHandlesTypes } from 'vtex.css-handles'
import { Link, useRuntime } from 'vtex.render-runtime'
import { CssHandlesList } from 'vtex.css-handles/react/CssHandlesTypes'
import { useApolloClient } from 'react-apollo'

import GET_Cat_Tree from '../../graphql/getCategoryTree.gql'
import GET_ORDERFORM from '../../graphql/getOrderForm.gql'
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
  categoryID?: number
  sellerID?: number
  blockClass?: string
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

interface Category {
  id: number
  name: string
  hasChildren: boolean
  children: [Category]
}

interface Seller {
  id: number
  name: string
}

function AdvancedNotificationBar({
  content,
  color,
  link,
  linkText,
  icon,
  notifBarIdx,
  categoryID,
  sellerID,
  blockClass,
  classes,
}: Props) {
  const { route } = useRuntime()
  const client = useApolloClient()
  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  const [show, setShow] = useState(false)

  const pageID = route?.pageContext?.id

  const block = ([blockClass] as CssHandlesList) ?? ([''] as CssHandlesList)
  const { handles: customBlockClass } = useCssHandles(block)
  const cssBlockClass = customBlockClass[Object.keys(customBlockClass)[0]]

  const findMatchingCategory = (departaments: [Category], findId: string) => {
    let result = {}

    departaments.forEach((dep: Category) => {
      if (String(dep.id) === String(findId)) {
        result = dep
      }

      dep?.children?.forEach((cat: Category) => {
        if (String(cat.id) === String(findId)) {
          result = cat
        }

        cat?.children?.forEach((subcat: Category) => {
          if (String(subcat.id) === String(findId)) {
            result = subcat
          }

          subcat?.children?.forEach((subsubcat: Category) => {
            if (String(subsubcat.id) === String(findId)) {
              result = subsubcat
            }
          })
        })
      })
    })

    return Object(result)
  }

  const handleClose = () => {
    window?.sessionStorage?.setItem(
      `closeNotificationBar-${notifBarIdx?.toString()}`,
      'true'
    )
    setShow(false)
  }

  useEffect(() => {
    if (
      !window?.sessionStorage?.getItem(
        `closeNotificationBar-${notifBarIdx?.toString()}`
      )
    ) {
      // For PLP pages with categoryID
      if (categoryID && !window.isNaN(Number(categoryID))) {
        client
          .query({
            query: GET_Cat_Tree,
          })
          .then(result => {
            // matched finds the id from admin props to an id in any category
            const matched = findMatchingCategory(
              result?.data?.categories,
              String(categoryID)
            )

            if (!matched || Object.keys(matched).length === 0) {
              return null
            }

            // check if the admin category matches the page id
            if (String(matched?.id) === String(pageID)) {
              setShow(true)

              return null
            }

            // matchChildren checks if the current page id is found in the matched category or any of its children
            const matchChildren = findMatchingCategory(
              matched?.children,
              pageID
            )

            if (!matchChildren || Object.keys(matchChildren).length === 0) {
              return null
            }

            setShow(true)

            return null
          })

        // For PDP pages with sellerID
      } else if (sellerID && !window.isNaN(Number(sellerID))) {
        client
          .query({
            query: GET_ORDERFORM,
          })
          .then(result => {
            const { sellers } = result?.data?.orderForm
            const filtered = sellers.filter(
              (seller: Seller) => String(seller.id) === String(sellerID)
            )

            if (filtered.length > 0) {
              setShow(true)
            }
          })

        // For other cases
      } else {
        setShow(true)
      }
    }
  }, [categoryID, client, notifBarIdx, pageID, sellerID])

  if (!content) {
    return null
  }

  const hasLink = link && linkText
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
      className={`${handles.notificationBarContainer} ${cssBlockClass} w-100 pv3 flex items-center`}
      style={{ backgroundColor: background, height: '4.25rem' }}
    >
      <div
        className={`${handles.notificationBarInner} w-100 flex pr5 justify-start`}
      >
        <div
          style={{
            backgroundColor: iconBackground,
            borderRadius: '0 6.25rem 6.25rem 0',
            minWidth: '2.875rem',
            minHeight: '2.875rem',
          }}
          className={`${handles.notificationImageContainer} mr4 pa3 flex justify-center`}
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
              viewBox="0 0 20 20"
            />
          )}
        </div>

        <div
          className={`${handles.notificationContent} flex flex-column`}
          style={{ maxWidth: 'max-content', justifyContent: 'space-evenly' }}
        >
          <p
            style={{ color: textColor }}
            className={`${handles.notificationText} link f6 fw4 lh-solid tl ma0 flex items-center`}
          >
            {content !== '' ? content : 'Announcement bar text content'}
          </p>
          {hasLink && (
            <Link
              to={link}
              style={{ width: 'fit-content' }}
              className={`${handles.notificationLink} flex items-center`}
            >
              <p
                style={{ color: textColor }}
                className={`${handles.notificationLinkText} f7 b lh-solid tl underline ttu ma0`}
              >
                {linkText}
              </p>
              <AnnounceRight
                fill={fill}
                styleClass={handles.notificationArrowRight}
              />
            </Link>
          )}
        </div>

        <div style={{ flexGrow: 1 }} />

        <button
          onClick={() => handleClose()}
          className={`${handles.notificationCloseButton} bg-transparent bn pointer flex`}
        >
          <AnnounceClose
            fill={fill}
            styleClass={handles.notificationCloseIcon}
          />
        </button>
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
