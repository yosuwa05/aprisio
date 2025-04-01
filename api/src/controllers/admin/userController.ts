import { Elysia, t } from "elysia";
import { UserModel } from "../../models/usermodel";
import ExcelJS from "exceljs";

export const userController = new Elysia({
  prefix: "/user",
})

  // .get(
  //   "/all",
  //   async ({ query }) => {
  //     try {
  //       const { page, limit, q, gender, ageRange } = query;
  //       let _limit = limit || 10;
  //       let _page = page || 1;

  //       const searchQuery: any = {};

  //       if (q) {
  //         searchQuery.name = { $regex: q, $options: "i" };
  //       }

  //       if (gender && ["male", "female"].includes(gender.toLowerCase())) {
  //         searchQuery.gender = gender.toLowerCase();
  //       } else {
  //         searchQuery.gender = { $in: ["male", "female", null, ""] };
  //       }

  //       if (ageRange) {
  //         const [minAge, maxAge] = ageRange.split("-").map(Number);
  //         const currentYear = new Date().getFullYear();
  //         const maxDOB = new Date(`${currentYear - minAge}-01-01`); // Younger limit
  //         const minDOB = new Date(`${currentYear - maxAge}-12-31`); // Older limit
  //         console.log(minDOB,maxDOB)
  //         searchQuery.dateOfBirth = { $gte: minDOB, $lte: maxDOB };
  //       }

  //       const users = await UserModel.find(searchQuery)
  //         .skip((_page - 1) * _limit)
  //         .limit(_limit)
  //         .sort({ createdAt: -1 })
  //         .select("email address name mobile active createdAt gender dateOfBirth")
  //         .exec();

  //       const totalUsers = await UserModel.countDocuments(searchQuery);

  //       return {
  //         users,
  //         status: "success",
  //         total: totalUsers,
  //       };
  //     } catch (error) {
  //       console.log(error);
  //       return {
  //         error,
  //         status: "error",
  //       };
  //     }
  //   },
  //   {
  //     query: t.Object({
  //       page: t.Number({
  //         default: 1,
  //       }),
  //       limit: t.Number({
  //         default: 10,
  //       }),
  //       q: t.Optional(
  //         t.String({
  //           default: "",
  //         })
  //       ),
  //       gender: t.Optional(
  //         t.String({
  //           default: "",
  //         })
  //       ),
  //       ageRange: t.Optional(
  //         t.String({
  //           default: ""
  //         })
  //       ),
  //     }),
  //     detail: {
  //       summary: "Get all users for admin panel with gender and age range filter",
  //     },
  //   }
  // )
  .get(
    "/all",
    async ({ query }) => {
      try {
        const { page, limit, q, gender, ageRange } = query;
        let _limit = Number(limit) || 10;
        let _page = Number(page) || 1;

        const searchQuery: any = {};

        if (q) {
          searchQuery.name = { $regex: q, $options: "i" };
        }

        if (gender && ["male", "female"].includes(gender.toLowerCase())) {
          searchQuery.gender = gender.toLowerCase();
        } else {
          searchQuery.gender = { $in: ["male", "female", null, ""] };
        }

        let ageFilter = {};
        if (ageRange && ageRange.includes("-")) {
          const [minAge, maxAge] = ageRange.split("-").map(Number);
          const currentYear = new Date().getFullYear();

          const maxDOB = new Date(currentYear - minAge, 0, 1); // 1st Jan of minAge
          const minDOB = new Date(currentYear - maxAge, 11, 31); // 31st Dec of maxAge

          console.log("Min DOB:", minDOB, "Max DOB:", maxDOB);

          ageFilter = {
            $expr: {
              $and: [
                {
                  $ne: ["$dateOfBirth", ""],
                },
                {
                  $ne: ["$dateOfBirth", null],
                },
                {
                  $gte: [
                    {
                      $dateFromString: {
                        dateString: "$dateOfBirth",
                        format: "%d-%m-%Y",
                        onError: null,
                      },
                    },
                    minDOB,
                  ],
                },
                {
                  $lte: [
                    {
                      $dateFromString: {
                        dateString: "$dateOfBirth",
                        format: "%d-%m-%Y",
                        onError: null,
                      },
                    },
                    maxDOB,
                  ],
                },
              ],
            },
          };
        }

        const users = await UserModel.find({
          ...searchQuery,
          ...ageFilter,
        })
          .skip((_page - 1) * _limit)
          .limit(_limit)
          .sort({ createdAt: -1 })
          .select("email address name mobile active createdAt gender dateOfBirth")
          .exec();

        const totalUsers = await UserModel.countDocuments({
          ...searchQuery,
          ...ageFilter,
        });

        return {
          users,
          status: "success",
          total: totalUsers,
        };
      } catch (error) {
        console.log(error);
        return {
          error,
          status: "error",
        };
      }
    }
  )

  .get(
    "/:id",
    async ({ params }) => {
      try {
        const { id } = params;

        const user = await UserModel.findById(id, "-password");

        if (!user) {
          return { message: "User not found" };
        }

        return {
          user,
          status: "success",
        };
      } catch (error) {
        console.log(error);
        return {
          error,
          status: "error",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Get a user by id",
      },
    }
  )
  .post(
    "/banuser/:id",
    async ({ params }) => {
      try {
        const { id } = params;

        const user = await UserModel.findById(id);
        if (!user) {
          return { message: "User not found" };
        }

        user.active = !user.active;
        await user.save();

        return {
          user,
          status: "success",
        };
      } catch (error) {
        console.log(error);
        return {
          error,
          status: "error",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Deactivate a user by id",
      },
    }
  )
  .get("/export-excel", async ({ set }) => {
    try {
      const users = await UserModel.find({}).select("email mobile name dateOfBirth gender");

      if (!users || users.length === 0) {
        set.status = 400;
        return {
          message: "No users found"
        };
      }

      const workbook = new ExcelJS.Workbook()
      const workSheet = workbook.addWorksheet('Users')

      workSheet.columns = [
        { header: 'Name', key: 'name', width: 40 },
        { header: 'Mobile', key: 'mobile', width: 20 },
        { header: 'Email', key: 'email', width: 50 },
        { header: 'Date of Birth', key: 'dateOfBirth', width: 20 },
        { header: 'Gender', key: 'gender', width: 20 },
      ]
      workSheet.getRow(1).font = { bold: true, size: 15 };
      workSheet.getRow(1).alignment = { horizontal: 'center' };


      users.forEach((user: any) => {
        workSheet.addRow({
          name: user.name,
          mobile: user.mobile,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
        });
      })

      workSheet.columns.forEach((column) => {
        column.alignment = { vertical: 'middle', horizontal: 'left' };
      });

      const buffer = await workbook.xlsx.writeBuffer()

      const date = new Date().toISOString().split('T')[0]
      const newFileName = `Aprisio_Users-${date}.xlsx`;

      console.log(newFileName)

      // set.headers = {
      //   'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      //   'content-disposition': `attachment; filename=${newFileName}`,
      //   'access-control-allow-origin': "*"
      // };

      set.headers = {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=${newFileName}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Content-Disposition",
      };


      return new Uint8Array(buffer);


    } catch (error: any) {
      console.log(error)
      set.status = 500
      return {
        message: error
      }
    }
  })
