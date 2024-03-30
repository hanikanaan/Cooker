import { fetchUser, fetchUsers, getNotifications } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";



async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect('/onboarding');

  const notifications = await getNotifications(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Your Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <Link key={notification._id} href={`/post/${notification.parentId}`}>
                <article className="activity-card">
                  <Image 
                    src={notification.author.image}
                    alt={`${notification.author.username}'s Profile Picture`}
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className=" px-4 !text-small-regular text-light-2 ">
                    <span className="mr-1 text-primary-500">
                      {notification.author.name}
                    </span>{' '} replied to your post.
                  </p>
                </article>
              </Link>
            ))}
          </>
        ): <p className="!text-base-regular text-light-3">No activity yet</p>}
      </section>
    </section>
  )
}

export default Page;
