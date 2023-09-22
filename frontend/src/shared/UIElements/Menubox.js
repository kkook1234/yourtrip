import React, { useState, useRef, useEffect } from "react";

import "./Menubox.css";
import Card from "./Card";
import { validate } from "../util/validators";

const Iscontent = (
  content,
  handleInputChange,
  buttondisabled,
  setButtondisabled,
  validatecheck,
  setValidatecheck,
  handleImageChange
) => {
  const [imgFile, setImgFile] = useState();
  const [imgUrl, setImgUrl] = useState();
  const [errortext, setErrortext] = useState("");
  const [textvalue, setTextvalue] = useState(content.existing || "");

  useEffect(() => {
    setTextvalue(content.existing || "");
  }, [content.existing]);

  const texthandler = (e) => {
    setTextvalue(e.target.value);
  };

  useEffect(() => {
    //입력값이 전부 충족되었는지
    let checkpoint = 0;
    for (const key in validatecheck) {
      if (validatecheck[key] === true) {
        checkpoint += 1;
      }
    }

    if (checkpoint === 0) {
      setButtondisabled(false);
    } else {
      setButtondisabled(true);
    }
  }, [validatecheck]);

  function check(e) {
    const { name, value } = e.target;

    const message = validate(value, content.validate);
    if (message != "") {
      setValidatecheck({ ...validatecheck, [name]: true });
    } else {
      setValidatecheck({ ...validatecheck, [name]: false });
    }

    setErrortext(message);
  }

  const filePickerRef = useRef();
  let reader;
  // 이미지 업로드 input의 onChange
  const saveImgFile = (event) => {
    const file = filePickerRef.current.files[0];

    if (!file) {
      return;
    } else {
      reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };
    }
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setImgFile(pickedFile);
      handleImageChange(pickedFile);
    }
    setValidatecheck({ ...validatecheck, image: false });
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  switch (content.type) {
    case "input":
      return (
        <React.Fragment>
          <div>
            <div className={`menubox-contents-title`}>{content.title}</div>
            <input
              name={content.id}
              className={`menubox-contents-input ${content.className}`}
              value={textvalue}
              onChange={(e) => {
                handleInputChange(e);
                check(e);
                texthandler(e);
              }}
            ></input>
            <div className="errortext">{errortext}</div>
          </div>
        </React.Fragment>
      );
    case "text":
      return (
        <React.Fragment>
          <div>
            <div className={`menubox-contents-title`}>{content.title}</div>
            <textarea
              name={content.id}
              className={`menubox-contents-input ${content.className}`}
              value={textvalue}
              onChange={(e) => {
                handleInputChange(e);
                check(e);
                texthandler(e);
              }}
            ></textarea>
            <div className="errortext">{errortext}</div>
          </div>
        </React.Fragment>
      );
    case "button":
      let type;
      if (content.formtype) {
        type = "submit";
      } else {
        type = "button";
      }
      return (
        <React.Fragment>
          <button
            className={`menubox-contents-btn ${content.className} center`}
            type={type}
            disabled={buttondisabled}
          >
            {content.title}
          </button>
        </React.Fragment>
      );
    case "image":
      return (
        <React.Fragment>
          <input
            ref={filePickerRef}
            style={{ display: "none" }}
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={saveImgFile}
          />
          <div className="menubox-contents-center">
            <div className="menubox-contents-title">{content.title}</div>
            {imgUrl ? (
              <img
                className="menubox-contents-image-img"
                src={imgUrl}
                alt="content"
              ></img>
            ) : (
              <React.Fragment>
                {content.existing ? (
                  <img
                    className="menubox-contents-image-img"
                    src={`${
                      process.env.REACT_APP_ASSET_URL
                    }${content.existing.replace(/\\/g, "/")}`}
                  ></img>
                ) : (
                  <div className="menubox-contents-image">
                    이미지를 선택해주세요.
                  </div>
                )}
              </React.Fragment>
            )}
            <div className="errortext">{errortext}</div>
            <div
              className={`menubox-contents-btn loginbtn center`}
              onClick={pickImageHandler}
            >
              이미지 선택
            </div>
          </div>
        </React.Fragment>
      );
    default:
  }
};

const Menubox = (props) => {
  const [buttondisabled, setButtondisabled] = useState(true);
  const validatecheck = props.validatecheck;
  const setValidatecheck = props.setValidatecheck;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    props.setinput({
      ...props.input,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    props.setinput({
      ...props.input,
      image: e,
    });
  };

  return (
    <React.Fragment>
      <form onSubmit={props.onSubmit}>
        <Card className="menubox">
          <div className="menubox-menu">{props.menu}</div>
          <span />
          <div className="menubox-contents">
            {props.contents.map((content, index) => {
              return (
                <div className="center" key={index}>
                  {Iscontent(
                    content,
                    handleInputChange,
                    buttondisabled,
                    setButtondisabled,
                    validatecheck,
                    setValidatecheck,
                    handleImageChange
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </form>
    </React.Fragment>
  );
};

export default Menubox;
