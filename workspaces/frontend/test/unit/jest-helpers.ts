const inheritRoles = (sectionRoles, mainRoles, itemRoles, subRoles) => {
  const allRoles = []
  if (sectionRoles) {
    sectionRoles.forEach(val => allRoles.push(val))
  }
  if (mainRoles) {
    mainRoles.forEach(val => allRoles.push(val))
  }
  if (itemRoles) {
    itemRoles.forEach(val => allRoles.push(val))
  }
  if (subRoles) {
    subRoles.forEach(val => allRoles.push(val))
  }
  return allRoles.length > 0 ? allRoles : null
}

export const getTopLevelOptionsAsArray = (headerMenuOptions) => {
  return headerMenuOptions().map(val => {
    return {
      label: val.label,
      validRoles: inheritRoles(val.validRoles),
      invalidRoles: inheritRoles(val.invalidRoles),
      toPath: val.toPath,
      ...val.isAllowed && { isAllowed: val.isAllowed }
    }
  })
}

export const getAllMenuItemsAsArray = (headerMenuOptions) => {
  return headerMenuOptions().map(val => {

    if (val.dropdownData) {
      let items = null
      const subItems = []
      const dropdownData = val.dropdownData
      for (const s in dropdownData) {
        const section = dropdownData[s]
        const sectionItems = section.items.map(item => {
          if (item.subItems) {
            subItems.push(...item.subItems.map(subItem => {
              return {
                label: subItem.label,
                validRoles: inheritRoles(section.validRoles, val.validRoles, item.validRoles, subItem.validRoles),
                invalidRoles: inheritRoles(section.invalidRoles, val.invalidRoles, item.invalidRoles, subItem.invalidRoles),
                toPath: subItem.toPath,
                ...subItem.isAllowed && { isAllowed: subItem.isAllowed }
              }
            }))
          }
          return {
            label: item.label,
            validRoles: inheritRoles(section.validRoles, val.validRoles, item.validRoles),
            invalidRoles: inheritRoles(section.invalidRoles, val.invalidRoles, item.invalidRoles),
            toPath: item.toPath,
            ...item.isAllowed && { isAllowed: item.isAllowed }
          }
        })
        items = sectionItems
      }
      return [ ...items, ...subItems ]
    }

    return {
      label: val.label,
      validRoles: val.validRoles,
      invalidRoles: val.invalidRoles,
      toPath: val.toPath,
      ...val.isAllowed && { isAllowed: val.isAllowed }
    }

  }).flat()
}
