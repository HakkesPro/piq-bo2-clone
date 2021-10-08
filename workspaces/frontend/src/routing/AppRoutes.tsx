import type { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { getMenuItems } from 'utils/menu-items';
import type { MenuItem } from 'types/menu-items-types';
import type { PaymentIqRoles } from 'types/service/metadata';
import { useAppSelector } from 'redux/hooks';
import type { SetShowLegacy } from 'types/global-types';

interface Props {
  setShowLegacy: SetShowLegacy;
}

const AppRoutes: FC<Props> = ({ setShowLegacy }) => {
  const userRoles = useAppSelector(
    ({ metadataReducer }) => metadataReducer.roles,
  );
  if (userRoles.length === 0) {
    return null;
  }

  return <Switch>{getAllRoutes(userRoles, setShowLegacy)}</Switch>;
};

interface Args extends Required<Pick<MenuItem, 'id' | 'toPath' | 'cmpnt'>> {
  setShowLegacy: SetShowLegacy;
}
type GetRouteComponent = (arg: Args) => JSX.Element;
const getRouteComponent: GetRouteComponent = ({
  id,
  toPath,
  cmpnt: Cmpnt,
  setShowLegacy,
}) => (
  <Route
    key={id}
    exact
    path={toPath}
    render={(props) => (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Cmpnt {...props} viewId={id} setShowLegacy={setShowLegacy} />
    )}
  />
);

type GetAllRoutes = (
  userRoles: Array<PaymentIqRoles>,
  setShowLegacy: SetShowLegacy
) => any;
const getAllRoutes: GetAllRoutes = (userRoles, setShowLegacy) => {
  const menuItems = getMenuItems(userRoles);
  const allRoutes = menuItems.map((item) => {
    const {
      id, toPath, cmpnt, dropdownData,
    } = item;
    const dropdownRoutes:any[] = [];

    if (toPath && cmpnt) {
      return getRouteComponent({
        id, toPath, cmpnt, setShowLegacy,
      });
    }
    if (dropdownData) {
      Object.values(dropdownData).forEach((section) => {
        /*
        * @returns {array} Array with dropdownroutes and also nested arrays with sub-dropdownroutes
        */
        const subRoutes = section
          && section.items.map((dropDownItem) => {
            if (dropDownItem.toPath && dropDownItem.cmpnt) {
              return getRouteComponent({
                id: dropDownItem.id,
                toPath: dropDownItem.toPath,
                cmpnt: dropDownItem.cmpnt,
                setShowLegacy,
              });
            }
            if (dropDownItem.subItems) {
              return dropDownItem.subItems.map((subItem) =>
                (subItem.toPath
                && subItem.cmpnt
                  ? getRouteComponent({
                    id: subItem.id,
                    toPath: subItem.toPath,
                    cmpnt: subItem.cmpnt,
                    setShowLegacy,
                  })
                  : null));
            }
            return null;
          });

        dropdownRoutes.push(subRoutes);
      });

      return dropdownRoutes;
    }
    return null;
  });

  return allRoutes;
};

export default AppRoutes;
