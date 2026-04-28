---
date: 2021-12-09
source: se
source_detail: "se post pm_33497 by u/Lova"
url: "https://pm.stackexchange.com/questions/33497/what-is-the-best-practice-for-combining-a-pull-request-based-workflow-with-qa-te"
topic: "What is the best practice for combining a pull request-based workflow with QA testing feedback in Azure DevOps?"
author: Lova
engagement: 11
created_utc: 2021-12-09T15:33:33Z
pain_keywords: ["\\btried .{1,40}? but\\b"]
confidence: medium
status: raw
raw_intake_version: plan_b_v1
---

# What is the best practice for combining a pull request-based workflow with QA testing feedback in Azure DevOps?

> **Source**: https://pm.stackexchange.com/questions/33497/what-is-the-best-practice-for-combining-a-pull-request-based-workflow-with-qa-te

## 原始内容

Background

I am a developer in a large software development company. We have a git workflow where we have master which is our main branch, which is supposed to be stable. Everything that goes into it has been QA tested. From this branch we then create release branches, which we can backport fixes to if needed.

All development is made in separate branches, and handled using the pull requests feature in Azure DevOps. Development usually starts from a user story, in which case a branch is created from and connected to that particular user story. Once development is finished, one or more code reviewers are assigned to the pull request, and the pull request is only complete once all code reviewers have approved. So far so good.

Parallel to the review, QA test also starts looking at the user story, doing all kind of tests to ensure that the code works according to the specification in the user story, and that it does not break anything else. This is the tricky part.

We handle this by letting the QA tester comment in the discussion part of the user story, documenting any issues they find. This is used in tandem with the state field on the user story to indicate whether the user story is currently in progress, under review, or in the testing phase.

When QA test passes, the tester changes the user story to state Test OK, and approves the PR. This, in combination with approval from all code reviewers, allows the completion of the pull request. When the pull request is closed, the user story is closed automatically.
Problem

The workflow outlined above works ok in most cases, but for larger development, we tend to create a feature which holds multiple user stories as children. For these cases, we only want to merge everything to master once the entire feature is completed. Therefore, we create a feature branch for the entire feature.

Since we want to be able to make reasonable estimations, we still want to divide the feature into several user stories. Each of these child user stories might also have its own branch, which gets merged into the feature branch instead of master. This allows us to do code reviews and QA testing per user story, which helps catch issues early in the development.

When all user stories are completed, however, we still want to QA test the entire feature, and this might give rise to issues which need to be fixed.

Now the question arises of how to handle QA feedback. All of the user stories are probably closed, since their branches have been merged into the feature branch as a result of QA and code reviewer approval.

This is where we have the problem. How do we handle the QA feedback loop here? Where should QA feedback go? Which branch should the fixes go into? Code reviewing works good, since it is carried out in the pull request, and will therefore be the same no matter if the branch is connected to a user story or a feature.
Possible solutions
Let the QA testers use the pull request workflow as well.

From a philosophical point of view, I kind of like this. The QA review and the code review are equally important, and approval are required from both parties for a pull request to be completed. The pull request interface also provides obvious benefits compared to leaving QA feedback in the discussion of user stories, since an individual comment can have a status. It's also nice for a code reviewer to immediately see the connection between QA feedback and a new code push.

The downside of this is that our QA testers are not very technical at all. They have a lot of knowledge about the business logic and the application, but not of the code. Due to that, it feels wrong to have them leave feedback in a pull request, which is very focused on the code. We have raised the idea of of working this way as one possible solution, but it has been met with resistance from the QA testers. They fear that they would lose overview compared to using the discussion area in the user stories, as their QA feedback would be mixed with code reviewer feedback. Another problem which has been raised is the searchability. Currently, the QA testers can search through old test logs to find solutions to problems, or easily refer to test logs in old, closed user stories. That would be made much more difficult if the feedback was left in the pull requests.
Extend the features to be equivalent to user stories.

Our features have a very different set of fields compared to user stories. One solution could be to make them more alike, adding support for discussions and states also to a feature. That way, test feedback could go directly into the feature in case of a feature branch. The downside of this is that features are normally only used by our product manager for planning our releases, and adding these fields and states to a feature feels wrong. Or maybe not?
Use a user story for QA testing.

One possible solution is to use a separate user story for testing. All feedback would then go into this user story. The downside is that there will be no obvious connection to the branch, as the fixes for the QA feedback will most likely go into the feature branch directly. It will also be much trickier to set a proper state for the test user story. The QA tester would be the one assigned to the user story, but what does "in progress" mean then? Does it mean that testing is in progress? If so, how does one indicate that there is QA test feedback? Usually, the QA tester would change the state to "in progress" and assign the user story back to the programmer when the QA test fails.
Create bugs for every issue found during QA testing.

This is another potential solution. QA could then create one bug per issue, describing how to reproduce it. One positive effect of this would be that we could create a separate branch for each bug fix, should we want to, and then review and QA test it separately.

A possible downside is that it feels wrong to create bugs for features which have not been released to the customer yet, as it will inflate bug statistics for example.
Other solutions?

I have tried searching for best practices, but to no avail. Are there resources I have missed, which deals with integrating a QA testing feedback loop with pull requests in Azure DevOps? Perhaps anyone wants to share their experience with how they work with QA testing feedback loop together with pull requests in their usage of Azure DevOps?

Should we maybe consider working in a different way all together?

If I could dream, I guess what I would want is for the pull request step to be divided into two different review parts, or two different views. One for code reviewers, and one for QA testers. The QA testing part would contain information more suitable to QA testing feedback, rather than code, and comments from QA testers and code reviewers would be kept separate.

## 自动提取的痛点信号

- 命中关键词: \btried .{1,40}? but\b
- 互动度: 11
- 作者: u/Lova

<!-- 处理: 调度员 → 5 阶段 pipeline -->
