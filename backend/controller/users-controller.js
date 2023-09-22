const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");

const User = require("../models/user");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("회원 정보를 확인할 수 없습니다.", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getuserbyuserid = (req, res, next) => {
  const userId = req.params.userid;
  const user = Dummy_users.find((u) => {
    return u.userid == userId;
  });
  res.json({ user: user });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("입력 정보를 확인하세요.", 422));
  }
  const { nickname, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }); //기존 이메일이 있는지 확인
  } catch (err) {
    const error = new HttpError("회원가입 실패. 다시 시도해 주세요.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("이미 사용중인 이메일 입니다.", 422);
    return next(error);
  }
  let existingnick;
  try {
    existingnick = await User.findOne({ nickname: nickname }); //기존 이메일이 있는지 확인
  } catch (err) {
    const error = new HttpError("회원가입 실패. 다시 시도해 주세요.", 500);
    return next(error);
  }

  if (existingnick) {
    const error = new HttpError("이미 사용중인 닉네임 입니다.", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "회원을 생성할 수 없습니다. 다시 시도해 주세요.",
      500
    );
    return next(error);
  }

  const createduser = new User({
    nickname,
    email,
    password: hashedPassword,
    trips: [],
  });

  let token;

  try {
    token = jwt.sign(
      { userId: createduser.id, email: createduser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("회원가입 실패. 다시 시도해 주세요.", 500);
    return next(error);
  }

  try {
    await createduser.save();
  } catch (err) {
    const error = new HttpError("회원가입 실패. 다시 시도해 주세요.", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createduser.id, eamil: createduser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("로그인 실패. 다시 시도해 주세요.", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("회원정보가 맞지 않습니다.", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("로그인 실패. 다시 시도해 주세요.", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("회원정보가 맞지 않습니다.", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("로그인 실패. 다시 시도해 주세요.", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.getuserbyuserid = getuserbyuserid;
exports.signup = signup;
exports.login = login;
