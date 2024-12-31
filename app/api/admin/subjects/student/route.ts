import dbConnect from "../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {StudentModel} from "../../../../../model/User";

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        {error: 'User is not admin'},
        {status: 401}
      );
    }

    const {student_id, subject_id} = await req.json();

    if (!student_id || !subject_id) {
      return NextResponse.json(
        {error: "subject id and student id is required"},
        {status: 403}
      )
    }

    const students = await StudentModel.aggregate([
      {
        $match: {
          student_id: { $regex: `^${student_id}` },
        }
      },
      {
        $set: {
          enrolledSubjectId: {
            $concatArrays: [
              "$enrolledSubjectId",
              [subject_id]
            ]
          }
        }
      }
    ])

    if (!students) {
      return NextResponse.json(
        {error: "failed to update students"},
        {status: 500}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}