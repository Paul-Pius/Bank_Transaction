(1)[
  {
    $match: {
      name: {
        $regex: new RegExp("Reg"),
      },
    },
  }
];
(2)[
  {
    $match: {
      borough: "Bronx",
      $or: [
        {
          cuisine: "American",
        },
        {
          cuisine: "Chinese",
        },
      ],
    },
  }
];
(3)[
  {
    $match: {
      $or: [
        {
          borough: "Staten Island",
        },
        {
          borough: "Queens",
        },
        {
          borough: "Bronxor Brookylyn",
        },
      ],
    },
  }
];
(4)[
  {
    $match: {
      borough: {
        $nin: ["Staten Island", "Queens", "Bronxor Brookylyn"],
      },
    },
  }
];
(5)[
  {
    $match: {
      "grades.score": {
        $lte: 10,
      },
    },
  }
];
(6)[
  {
    $match: {
      name: {
        $regex: new RegExp("^Will*"),
      },
      $nor: [
        {
          cuisine: {
            $in: ["American", "Chinese"],
          },
        },
      ],
    },
  }
];
(7)[
  {
    $match: {
      grades: {
        $elemMatch: {
          date: new Date("Mon, 11 Aug 2014 00:00:00 GMT"),
          grade: "A",
          score: 11,
        },
      },
    },
  }
];
(8)[
  {
    $match: {
      $and: [
        {
          "grades.1.grade": "A",
        },
        {
          "grades.1.score": 9,
        },
        {
          "grades.1.date": new Date("Mon, 11 Aug 2014 00:00:00 GMT"),
        },
      ],
    },
  }
];
(9)[
  {
    $match: {
      $and: [
        {
          "address.coord.1": {
            $gt: 42,
          },
        },
        {
          "address.coord.1": {
            $lte: 52,
          },
        },
      ],
    },
  }
];
(10)[
  {
    $sort: {
      name: 1,
    },
  }
];
(11)[
  {
    $sort: {
      name: -1,
    },
  }
];
(12)[
  {
    $sort: {
      cuisine: 1,
      borough: -1,
    },
  }
];
(13)[
  {
    $match: {
      "address.street": {
        $regex: new RegExp("Street"),
      },
    },
  }
];
