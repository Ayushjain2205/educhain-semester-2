// pages/api/telegram/webhook.js

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// In-memory store for user data (replace with database in production)
const userBalances = new Map();
const userStreaks = new Map();

async function updateUserBalance(chatId, amount) {
  const currentBalance = userBalances.get(chatId) || 0;
  const newBalance = currentBalance + amount;
  userBalances.set(chatId, newBalance);
  return newBalance;
}

async function updateUserStreak(chatId) {
  const currentStreak = userStreaks.get(chatId) || 0;
  userStreaks.set(chatId, currentStreak + 1);
  return currentStreak + 1;
}

async function sendMessage(chatId, text, keyboard = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    ...(keyboard && { reply_markup: { inline_keyboard: keyboard } }),
  };

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  await new Promise((resolve) => setTimeout(resolve, 800));
}

async function simulateConversation(chatId, trigger) {
  switch (trigger) {
    case "/start":
      const currentBalance = userBalances.get(chatId) || 0;
      await sendMessage(
        chatId,
        `🇫🇷 Bonjour! I'm FrenchTutor!\n\n` +
          `Your current balance: ${currentBalance} $FRENCH\n\n` +
          `Let's make learning French fun and rewarding!`
      );
      await sendMessage(chatId, "What would you like to do?", [
        [
          {
            text: "📚 Start Today's Lesson (10 $FRENCH)",
            callback_data: "daily_lesson",
          },
        ],
        [
          {
            text: "🗣️ Practice Conversation (5 $FRENCH)",
            callback_data: "practice",
          },
        ],
        [
          {
            text: "📝 Daily Phrase (3 $FRENCH)",
            callback_data: "daily_phrase",
          },
        ],
        [{ text: "🎯 Quick Quiz (2 $FRENCH)", callback_data: "quiz" }],
        [{ text: "💰 Check Balance", callback_data: "check_balance" }],
      ]);
      break;

    case "daily_lesson":
      await sendMessage(
        chatId,
        "📚 Today's Lesson: Ordering at a Café\n\n" +
          "Let's learn how to order your favorite French coffee and pastries!\n\n" +
          "Lesson Progress: ▮▮▮▮▯ 4/5 steps"
      );
      await sendMessage(
        chatId,
        "Key Phrases:\n\n" +
          "1. Je voudrais un café ☕\n" +
          "(I would like a coffee)\n\n" +
          "2. Un croissant, s'il vous plaît 🥐\n" +
          "(A croissant, please)\n\n" +
          "3. L'addition, s'il vous plaît 📝\n" +
          "(The bill, please)",
        [
          [{ text: "▶️ Start Practice", callback_data: "lesson_practice" }],
          [{ text: "🔄 Main Menu", callback_data: "/start" }],
        ]
      );
      break;

    case "lesson_practice":
      await sendMessage(
        chatId,
        "🗣️ Let's practice ordering!\n\n" +
          "How would you say 'I would like a coffee' in French?",
        [
          [{ text: "Je voudrais un café", callback_data: "practice_correct" }],
          [{ text: "Je suis un café", callback_data: "practice_wrong" }],
          [
            {
              text: "Un café s'il vous plaît",
              callback_data: "practice_partial",
            },
          ],
        ]
      );
      break;

    case "practice_correct":
      const practiceReward = 5;
      const newBalanceAfterPractice = await updateUserBalance(
        chatId,
        practiceReward
      );
      const streak = await updateUserStreak(chatId);

      let streakBonus = 0;
      if (streak % 5 === 0) {
        // Bonus every 5 days
        streakBonus = 2;
        await updateUserBalance(chatId, streakBonus);
      }

      await sendMessage(
        chatId,
        `✨ Parfait! That's correct!\n\n` +
          `🪙 Rewards:\n` +
          `• Practice Complete: +${practiceReward} $FRENCH\n` +
          `${streakBonus ? `• Streak Bonus: +${streakBonus} $FRENCH\n` : ""}` +
          `• Current Balance: ${newBalanceAfterPractice} $FRENCH\n\n` +
          `🔥 Current Streak: ${streak} days`,
        [
          [
            {
              text: "➡️ Continue Practice",
              callback_data: "lesson_practice_2",
            },
          ],
          [{ text: "💰 View Balance", callback_data: "check_balance" }],
        ]
      );
      break;

    case "lesson_practice_2":
      await sendMessage(
        chatId,
        "Final Practice:\n\n" + "How would you ask for the bill?",
        [
          [{ text: "Au revoir", callback_data: "final_wrong" }],
          [
            {
              text: "L'addition, s'il vous plaît",
              callback_data: "lesson_complete",
            },
          ],
          [{ text: "Merci beaucoup", callback_data: "final_wrong" }],
        ]
      );
      break;

    case "lesson_complete":
      const lessonReward = 10;
      const newBalance = await updateUserBalance(chatId, lessonReward);

      await sendMessage(
        chatId,
        "🎉 Félicitations! Lesson complete!\n\n" +
          `Rewards Earned:\n` +
          `• Lesson Completion: +${lessonReward} $FRENCH\n` +
          `• New Balance: ${newBalance} $FRENCH`
      );

      await sendMessage(chatId, "Ready for more learning?", [
        [{ text: "📚 Next Lesson", callback_data: "daily_lesson" }],
        [{ text: "💰 Check Balance", callback_data: "check_balance" }],
      ]);
      break;

    case "check_balance":
      const balance = userBalances.get(chatId) || 0;
      const currentStreak = userStreaks.get(chatId) || 0;

      await sendMessage(
        chatId,
        "💰 Your $FRENCH Wallet:\n\n" +
          `Current Balance: ${balance} $FRENCH\n\n` +
          `🔥 Learning Streak: ${currentStreak} days\n\n` +
          "Earn more by:\n" +
          "• Complete lesson: +10 $FRENCH\n" +
          "• Practice session: +5 $FRENCH\n" +
          "• Daily phrase: +3 $FRENCH\n" +
          "• Quick quiz: +2 $FRENCH\n" +
          "• 5-day streak bonus: +2 $FRENCH",
        [
          [{ text: "📚 Start Learning", callback_data: "daily_lesson" }],
          [{ text: "🔄 Main Menu", callback_data: "/start" }],
        ]
      );
      break;

    case "practice_wrong":
      await sendMessage(
        chatId,
        "❌ Not quite right. Let's try again!\n\n" +
          "Remember: 'Je voudrais' means 'I would like'",
        [
          [{ text: "🔄 Try Again", callback_data: "lesson_practice" }],
          [{ text: "📚 Review Lesson", callback_data: "daily_lesson" }],
        ]
      );
      break;

    case "daily_phrase":
      const phraseReward = 3;
      const phraseBalance = await updateUserBalance(chatId, phraseReward);

      await sendMessage(
        chatId,
        "📝 Today's French Phrase:\n\n" +
          '🇫🇷 "Comment allez-vous?"\n' +
          '🇬🇧 "How are you?"\n\n' +
          "🔊 Pronunciation: koh-mahn tah-lay voo\n\n" +
          `🪙 Reward: +${phraseReward} $FRENCH\n` +
          `Current Balance: ${phraseBalance} $FRENCH`,
        [
          [{ text: "🎯 Practice This", callback_data: "practice_phrase" }],
          [{ text: "📚 Start Lesson", callback_data: "daily_lesson" }],
        ]
      );
      break;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
    return;
  }

  try {
    const { message, callback_query } = req.body;

    if (callback_query) {
      const chatId = callback_query.from.id;
      await simulateConversation(chatId, callback_query.data);

      await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callback_query_id: callback_query.id,
          }),
        }
      );
    }

    if (message) {
      const chatId = message.chat.id;

      if (message.text === "/start") {
        await simulateConversation(chatId, "/start");
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Error processing webhook" });
  }
}
