import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { AiFillBell } from "react-icons/ai";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Notifications() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center items-center w-full px-4 py-2 font-medium text-white bg-transparent rounded-md shadow-sm hover:bg-[#2546bd] focus:outline-none">
          <AiFillBell />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right text-white bg-transparent white-glassmorphism rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <div
                  className={classNames(
                    active
                      ? "bg-[#2546bd] text-white cursor-not-allowed"
                      : "text-white",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  No new notifications
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
