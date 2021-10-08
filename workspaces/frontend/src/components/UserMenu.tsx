import type { FC } from 'react';
import {
  Dropdown,
  Icon,
  Button,
} from 'semantic-ui-react';
import { useAppSelector } from 'redux/hooks';
import { AuthApi } from 'service';

const UserMenu: FC = () => {
  const { userName, accountUrl, merchantId } = useAppSelector(
    ({ contextReducer }) => contextReducer,
  );

  const handleUserSettings = () => {
    if (accountUrl) {
      window.open(accountUrl, '_blank');
    }
  };

  const handleLogout = async () => {
    try {
      // successful logout returns a http 302 to keycloak
      await AuthApi.logout();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <Dropdown
      icon={(
        <Button icon>
          <Icon color="black" name="user" />
        </Button>
      )}
      floating
      className="icon circular"
    >
      <Dropdown.Menu>
        <Dropdown.Header icon="user" content={`Logged in as ${userName}`} />
        <Dropdown.Menu scrolling>
          <Dropdown.Item
            key="your-account"
            text="Your account"
            value="your-account"
            icon="user circle"
            onClick={handleUserSettings}
          />

          <Dropdown.Item
            key="logout"
            text="Logout"
            value="logout"
            icon="log out"
            onClick={handleLogout}
          />

          <Dropdown.Header
            onClick={() => navigator.clipboard.writeText(merchantId.toString())}
            icon="suitcase"
            content={`Merchant ID: ${merchantId} - Click to copy MID`}
            style={{
              borderTop: '1px solid #cececef1',
              paddingTop: '10px',
              cursor: 'copy',
            }}
          />
        </Dropdown.Menu>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserMenu;
