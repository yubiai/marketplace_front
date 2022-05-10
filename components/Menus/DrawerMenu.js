import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon
} from "@chakra-ui/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import UserInfo from "../Infos/userInfo";
import { FaUserCircle } from "react-icons/fa";
import { BsFillBellFill } from "react-icons/bs";
import {
  MdSell,
  MdFavorite,
  MdHelp,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp
} from "react-icons/md";

const DrawerMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const [listCategory, onListCategory] = useState("false");
  const onCategory = () => {
    onListCategory(!listCategory);
  };

  return (
    <>
      <Button ref={btnRef} color="white" bg="transparent" onClick={onOpen}>
        <FiMoreVertical fontSize={"2em"} />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <UserInfo />
          </DrawerHeader>
          <Divider />

          <DrawerBody>
            <List spacing={3}>
              <ListItem>
                <Link href="/profile">
                  <Button
                    onClick={() => onClose()}
                    w="full"
                    bg="transparent"
                    justifyContent={"left"}
                  >
                    <ListIcon as={FaUserCircle} />
                    Profile
                  </Button>
                </Link>
              </ListItem>
              <ListItem>
                <Link href="/notifications">
                  <Button
                    onClick={() => onClose()}
                    w="full"
                    bg="transparent"
                    justifyContent={"left"}
                  >
                    <ListIcon as={BsFillBellFill} />
                    Notifications
                  </Button>
                </Link>
              </ListItem>
              <ListItem>
                <Link href="/sell">
                  <Button
                    onClick={() => onClose()}
                    w="full"
                    bg="transparent"
                    justifyContent={"left"}
                  >
                    <ListIcon as={MdSell} />
                    Sell
                  </Button>
                </Link>
              </ListItem>
              <ListItem>
                <Link href="/favorites">
                  <Button
                    onClick={() => onClose()}
                    w="full"
                    bg="transparent"
                    justifyContent={"left"}
                  >
                    <ListIcon as={MdFavorite} />
                    Favorites
                  </Button>
                </Link>
              </ListItem>
              <ListItem>
                <Link href="/help">
                  <Button
                    onClick={() => onClose()}
                    w="full"
                    bg="transparent"
                    justifyContent={"left"}
                  >
                    <ListIcon as={MdHelp} />
                    Help
                  </Button>
                </Link>
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => onCategory()}
                  w="full"
                  bg="transparent"
                  justifyContent={"left"}
                >
                  <ListIcon
                    as={listCategory ? MdKeyboardArrowUp : MdKeyboardArrowDown}
                  />
                  Categories
                </Button>
              </ListItem>
              {listCategory && (
                <>
                  <ListItem>
                    <Link href="/category/services">
                      <Button
                        onClick={() => onClose()}
                        w="full"
                        bg="transparent"
                        justifyContent={"left"}
                      >
                        <ListIcon as={MdHelp} />
                        Services
                      </Button>
                    </Link>
                  </ListItem>
                </>
              )}
            </List>
          </DrawerBody>

          <DrawerFooter>Yubiai</DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerMenu;
