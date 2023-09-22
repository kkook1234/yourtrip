const HttpError = require("../models/http-error");
const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const getCoordsForAddress = require("../util/location");
const Trip = require("../models/trip");
const User = require("../models/user");

const gettrip = async (req, res, next) => {
  let trips;
  try {
    trips = await Trip.find().populate("creator").sort({ date: -1 }).limit(10);
  } catch (err) {
    const error = new HttpError("회원 정보를 확인할 수 없습니다.", 500);
    return next(error);
  }

  res.json({ trips: trips.map((trip) => trip.toObject({ getters: true })) });
};

const gettripbytripid = async (req, res, next) => {
  //tripid로 여행정보 받기
  const tripId = req.params.tripid;
  let trip;
  try {
    trip = await Trip.findById(tripId).populate("creator", "nickname");
  } catch (err) {
    const error = new HttpError(
      "오류가 발생했습니다. 여행을 찾을 수 없습니다.",
      500
    );
    return next(error);
  }

  if (!trip) {
    const error = new HttpError("해당 여행을 찾을 수 없습니다.", 404);
    return next(error);
  }
  res.json({ trip: trip.toObject({ getters: true }) });
};

const gettripbyuserid = async (req, res, next) => {
  //userid로 여행정보 받기
  const creatorId = req.params.creatorid;
  let userWithTrip;
  try {
    // userWithTrip = await User.findById(creatorId).populate("trips");
    userWithTrip = await Trip.find({ creator: creatorId })
      .populate("creator", "nickname")
      .sort({ date: -1 })
      .limit(10);
  } catch (err) {
    const error = new HttpError("해당 유저의 여행을 찾을 수 없습니다.", 500);
    return next(error);
  }

  if (!userWithTrip || userWithTrip.length == 0) {
    return next(new HttpError("해당 유저의 여행을 찾을 수 없습니다.", 404));
  }
  res.json({
    trip: userWithTrip.map((trip) => trip.toObject({ getters: true })),
  });
};

const getmemobyday = async (req, res, next) => {
  //해당 day의 메모들 받기
  const tripId = req.params.tripid;
  const dayId = req.params.day;

  let trip;
  try {
    trip = await Trip.findById(tripId);
    memo = trip.memo[dayId - 1];
  } catch (err) {
    const error = new HttpError(
      "오류가 발생했습니다. 여행을 찾을 수 없습니다.",
      500
    );
    return next(error);
  }

  if (!trip) {
    const error = new HttpError("해당 여행을 찾을 수 없습니다.", 404);
    return next(error);
  }
  res.json({ memo: memo.toObject({ getters: true }) });
};

const getmemobymemoid = async (req, res, next) => {
  const tripId = req.params.tripid;
  const dayId = req.params.day;
  const memoId = req.params.memoid;
  let trip;
  try {
    trip = await Trip.findById(tripId);
  } catch (err) {
    const error = new HttpError(
      "오류가 발생했습니다. 여행을 찾을 수 없습니다.",
      500
    );
    return next(error);
  }

  if (!trip) {
    const error = new HttpError("해당 여행을 찾을 수 없습니다.", 404);
    return next(error);
  }
  const memo = trip.memo[dayId - 1].filter((props) => props._id == memoId);
  res.json({ memo: memo.map((trip) => trip.toObject({ getters: true })) });
};

const createTrip = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("데이터를 확인하세요", 422));
  }
  //여행 추가
  const { title } = req.body;
  const createdTrip = new Trip({
    title,
    creator: req.userData.userId,
    image: req.file.path,
    memo: [[]],
    date: new Date(),
  });

  let user;
  try {
    user = await User.findById(createdTrip.creator);
  } catch (err) {
    const error = new HttpError("여행 생성에 실패했습니다.", 500);
    return next(error); //안쓰면 중단안되고 뒤에 코드 실행됨
  }

  if (!user) {
    const error = new HttpError(
      "제공된 id에 해당하는 사용자를 찾을 수 없습니다.",
      404
    );
    return next(error); //안쓰면 중단안되고 뒤에 코드 실행됨
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdTrip.save({ session: sess });
    user.trips.push(createdTrip);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("여행 생성에 실패했습니다.", 500);
    return next(error); //안쓰면 중단안되고 뒤에 코드 실행됨
  }

  res.status(201).json({ place: createdTrip }); //서버에 새로운 데이터 등록 성공 시 201
};

const createDay = async (req, res, next) => {
  //day 추가
  const tripId = req.params.tripid;
  let trip;

  try {
    trip = await Trip.findById(tripId).populate("creator");
  } catch (err) {
    const error = new HttpError("여행을 생성할 수 없습니다.", 500);
    return next(error);
  }

  if (trip.creator._id.toString() !== req.userData.userId) {
    const error = new HttpError("이 여행의 작성자가 아닙니다.", 401);
    return next(error);
  }

  list1 = [];
  trip.memo.push(list1);

  try {
    await trip.save();
  } catch (err) {
    const error = new HttpError("여행을 생성할 수 없습니다.", 500);
    return next(error);
  }

  res.status(201).json({ trip: trip.toObject({ getters: true }) });
};

const createMemo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("데이터를 확인하세요", 422));
  }
  //메모 추가
  const { location, description } = req.body;

  let address;
  try {
    address = await getCoordsForAddress(location);
  } catch (error) {
    return next(error);
  }
  const createdMemo = {
    img: req.file.path,
    location,
    description,
    coordinates: address,
  };
  const tripId = req.params.tripid;
  const dayId = req.params.day;
  let trip;
  try {
    trip = await Trip.findById(tripId).populate("creator");
  } catch (err) {
    const error = new HttpError("메모를 생성할 수 없습니다.", 500);
    return next(error);
  }
  if (trip.creator._id.toString() !== req.userData.userId) {
    const error = new HttpError("이 여행의 작성자가 아닙니다.", 401);
    return next(error);
  }
  trip.memo[dayId - 1].push(createdMemo);

  try {
    await trip.save();
  } catch (err) {
    const error = new HttpError("메모를 생성할 수 없습니다.", 500);
    return next(error);
  }

  res.status(201).json({ trip: trip.toObject({ getters: true }) });
};

const updateTripbyid = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("데이터를 확인하세요", 422));
  }
  //여행 수정
  const { title } = req.body;
  const tripId = req.params.tripid;

  let trip;
  try {
    trip = await Trip.findById(tripId).populate("creator", "nickname");
  } catch (err) {
    const error = new HttpError("여행을 업데이트할 수 없습니다.", 500);
    return next(error);
  }

  if (trip.creator._id.toString() !== req.userData.userId) {
    const error = new HttpError("이 여행의 작성자가 아닙니다.", 401);
    return next(error);
  }

  if (req.file == undefined) {
    trip.title = title;
  } else {
    const imgPath = trip.image;
    trip.image = req.file.path;
    trip.title = title;

    fs.unlink(imgPath, (err) => {
      console.log(err);
    });
  }
  try {
    await trip.save();
  } catch (err) {
    const error = new HttpError("여행을 업데이트할 수 없습니다.", 500);
    return next(error);
  }

  res.status(200).json({ trip: trip.toObject({ getters: true }) });
};

const updateMemo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("데이터를 확인하세요", 422));
  }
  //메모 수정
  const { location, description } = req.body;

  let address;
  try {
    address = await getCoordsForAddress(location);
  } catch (error) {
    return next(error);
  }

  const tripId = req.params.tripid;
  const dayId = req.params.day;
  const memoId = req.params.memoid;

  let trip;
  try {
    trip = await Trip.findById(tripId).populate("creator", "nickname");
  } catch (err) {
    const error = new HttpError("메모를 업데이트할 수 없습니다.", 500);
    return next(error);
  }

  if (trip.creator._id.toString() !== req.userData.userId) {
    const error = new HttpError("이 여행의 작성자가 아닙니다.", 401);
    return next(error);
  }

  if (memoId > trip.memo[dayId - 1].length) {
    const error = new HttpError("해당 메모가 없습니다.", 500);
    return next(error);
  }
  const index = trip.memo[dayId - 1].findIndex((memo) => memo._id == memoId);

  if (req.file == undefined) {
    trip.memo[dayId - 1][index].location = location;
    trip.memo[dayId - 1][index].description = description;
  } else {
    const imgPath = trip.memo[dayId - 1][index].img;
    trip.memo[dayId - 1][index].img = req.file.path;
    trip.memo[dayId - 1][index].description = description;
    trip.memo[dayId - 1][index].location = location;

    fs.unlink(imgPath, (err) => {
      console.log(err);
    });
  }

  try {
    await trip.save();
  } catch (err) {
    const error = new HttpError("메모를 업데이트할 수 없습니다.", 500);
    return next(error);
  }

  res.status(200).json({ trip: trip.toObject({ getters: true }) });
};

const deleteTripbyid = async (req, res, next) => {
  const tripId = req.params.tripid;
  let trip;
  try {
    trip = await Trip.findById(tripId).populate("creator");
  } catch (err) {
    const error = new HttpError("해당 여행을 삭제할 수 없습니다.", 500);
    return next(error);
  }

  if (!trip) {
    const error = new HttpError("해당 여행을 찾을 수 없습니다.", 404);
    return next(error);
  }
  if (trip.creator._id.toString() !== req.userData.userId) {
    const error = new HttpError("이 여행의 작성자가 아닙니다.", 401);
    return next(error);
  }
  const imagePath = [];
  imagePath.push(trip.image);
  trip.memo.map((props) => {
    props.map((props2) => {
      imagePath.push(props2.img);
    });
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await trip.deleteOne({ session: sess });
    trip.creator.trips.pull(trip);
    await trip.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("해당 여행을 삭제할 수 없습니다.", 500);
    return next(error);
  }
  imagePath.map((props) => {
    fs.unlink(props, (err) => {
      console.log(err);
    });
  });

  res.status(200).json({ message: "여행 삭제" });
};

const deleteDay = async (req, res, next) => {
  const tripId = req.params.tripid;
  const dayId = req.params.day;
  let trip;
  try {
    trip = await Trip.findById(tripId).populate("creator", "nickname");
  } catch (err) {
    const error = new HttpError("해당 기록을 삭제할 수 없습니다.", 500);
    return next(error);
  }
  if (trip.creator._id.toString() !== req.userData.userId) {
    const error = new HttpError("이 여행의 작성자가 아닙니다.", 401);
    return next(error);
  }
  if (!trip.memo[dayId - 1]) {
    const error = new HttpError("해당 기록이 없습니다.", 500);
    return next(error);
  }
  let imagePath = [];

  const imgtrip = trip.memo.filter((memo, index) => index >= dayId - 1);
  imgtrip.map((props) => {
    props.map((props2) => {
      imagePath.push(props2.img);
    });
  });

  imagePath.map((props) => {
    fs.unlink(props, (err) => {
      console.log(err);
    });
  });

  trip.memo = trip.memo.filter((memo, index) => index < dayId - 1);

  try {
    await trip.save();
  } catch (err) {
    const error = new HttpError("해당 기록을 삭제할 수 없습니다.", 500);
    return next(error);
  }
  res.status(200).json({ message: "기록 삭제" });
};

const deleteMemo = async (req, res, next) => {
  const tripId = req.params.tripid;
  const dayId = req.params.day;
  const memoId = req.params.memoid;
  let trip;
  try {
    trip = await Trip.findById(tripId).populate("creator", "nickname");
  } catch (err) {
    const error = new HttpError("해당 기록을 삭제할 수 없습니다.", 500);
    return next(error);
  }

  if (trip.creator._id.toString() !== req.userData.userId) {
    const error = new HttpError("이 여행의 작성자가 아닙니다.", 401);
    return next(error);
  }

  const indexid = trip.memo[dayId - 1].findIndex((memo) => memo._id == memoId);
  const imgPath = trip.memo[dayId - 1][indexid].img;

  fs.unlink(imgPath, (err) => {
    console.log(err);
  });
  if (!trip.memo[dayId - 1][indexid]) {
    const error = new HttpError("해당 기록이 없습니다.", 500);
    return next(error);
  }
  trip.memo[dayId - 1] = trip.memo[dayId - 1].filter(
    (memo, index) => index !== indexid
  );

  try {
    await trip.save();
  } catch (err) {
    const error = new HttpError("해당 기록을 삭제할 수 없습니다.", 500);
    return next(error);
  }

  res.status(200).json({ message: "기록 삭제" });
};

const searchtrip = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("입력 정보를 확인하세요.", 422));
  }
  const keyword = req.body.keyword;

  let existingKeyword;
  try {
    existingKeyword = await Trip.find({
      title: { $regex: keyword, $options: "i" },
    }).populate("creator", "nickname");
  } catch (err) {
    const error = new HttpError("해당 여행기록이 없습니다.", 500);
    return next(error);
  }

  res.status(201).json({
    trips: existingKeyword.map((trip) => trip.toObject({ getters: true })),
  });
};

exports.gettrip = gettrip;
exports.searchtrip = searchtrip;
exports.gettripbytripid = gettripbytripid;
exports.gettripbyuserid = gettripbyuserid;
exports.getmemobyday = getmemobyday;
exports.getmemobymemoid = getmemobymemoid;
exports.createTrip = createTrip;
exports.createDay = createDay;
exports.createMemo = createMemo;
exports.updateTripbyid = updateTripbyid;
exports.updateMemo = updateMemo;
exports.deleteTripbyid = deleteTripbyid;
exports.deleteDay = deleteDay;
exports.deleteMemo = deleteMemo;
