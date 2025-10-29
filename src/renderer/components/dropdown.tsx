import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

interface DropdownProps {
  menuButtonText: string;
  allMenuItems?: Record<string, any>;
}

export default function Dropdown({
  menuButtonText,
  allMenuItems = {},
}: DropdownProps) {
  const hasItems = allMenuItems && Object.keys(allMenuItems).length > 0;

  return (
    <Menu>
      {menuButtonText !== '' && <MenuButton>{menuButtonText}</MenuButton>}

      {hasItems && (
        <MenuItems anchor="bottom">
          {Object.entries(allMenuItems).map(([key, value]) => {
            const href = typeof value === 'string' ? value : value?.href ?? '#';
            const label = typeof value === 'string' ? key : value?.label ?? key;

            return (
              <MenuItem key={key}>
                <a className="block data-focus:bg-blue-100" href={href}>
                  {label}
                </a>
              </MenuItem>
            );
          })}
        </MenuItems>
      )}
    </Menu>
  );
}
