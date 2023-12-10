import React, { Fragment, useEffect, useState } from "react";

const avatarData = [
  { id: 5, img: "avatar5.png" },
  { id: 8, img: "avatar8.png" },
  { id: 9, img: "avatar9.png" },

  { id: 11, img: "avatar11.png" },
  { id: 12, img: "avatar12.png" },
  { id: 13, img: "avatar13.png" },
  { id: 14, img: "avatar14.png" },
  { id: 16, img: "avatar16.png" },
  { id: 17, img: "avatar17.png" },
  { id: 18, img: "avatar18.png" },
  { id: 19, img: "avatar19.png" },
  { id: 20, img: "avatar20.png" },
];
const Avatar = ({ file, setfile }) => {
  const ASSETS = process.env.REACT_APP_ASSETS_ADMIN_USER;
  const [avatarImage, setAvatarImage] = useState(avatarData);
  const [onlyselectedAvatar, setOnlyselectedAvatar] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleImageClick = async (imageSrc, id) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], "avatar.png", { type: "image/png" });
      setfile(file);
      setOnlyselectedAvatar(file);
      setSelectedAvatar(id);
    } catch (error) {}
  };

  useEffect(() => {
    if (file !== onlyselectedAvatar) {
      setSelectedAvatar(null);
    }
  }, [file]);
  return (
    <Fragment>
      <h1 className="newUserTitle">Avatar</h1>
      <span className="newUserTitle">
        You Can Choose Your Avatar Or Upload Your Image
      </span>

      <div className="avatarContainer">
        {avatarImage?.map((o) => (
          <div key={o.id} className="avatarItem">
            <img
              width={80}
              height={80}
              src={ASSETS + o.img}
              alt=""
              onClick={() => handleImageClick(ASSETS + o.img, o.id)}
            />
            {selectedAvatar === o.id && (
              <img
                className="successAvatar"
                width={80}
                height={80}
                src={ASSETS + "/choosedavatar.png"}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default Avatar;
