// pages/api/telegram/webhook.js

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

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
        `🔬 Welcome to ScienceGuide!\n\n` +
          `Your current balance: ${currentBalance} $SCIENCE\n\n` +
          `Let's explore the wonders of science together!`
      );
      await sendMessage(chatId, "Choose your scientific adventure:", [
        [{ text: "🌌 Daily Discovery", callback_data: "daily_discovery" }],
        [{ text: "⚡ Quick Experiment", callback_data: "experiment" }],
        [{ text: "🧪 Science Fact", callback_data: "daily_fact" }],
        [{ text: "🔍 Quiz Time", callback_data: "quiz" }],
        [{ text: "🎓 Knowledge Points", callback_data: "check_balance" }],
      ]);
      break;

    case "daily_discovery":
      await sendMessage(
        chatId,
        "🌌 Today's Discovery: Black Holes\n\n" +
          "Let's explore one of the universe's most mysterious phenomena!\n\n" +
          "Progress: ▮▮▮▮▯ 4/5 concepts"
      );
      await sendMessage(
        chatId,
        "Key Concepts:\n\n" +
          "1. Event Horizon 🌑\n" +
          "The point of no return - not even light can escape!\n\n" +
          "2. Singularity 🎯\n" +
          "The infinitely dense center of a black hole\n\n" +
          "3. Hawking Radiation ✨\n" +
          "Black holes aren't completely black after all!",
        [
          [{ text: "▶️ Start Learning", callback_data: "lesson_start" }],
          [{ text: "🔄 Main Menu", callback_data: "/start" }],
        ]
      );
      break;

    case "lesson_start":
      await sendMessage(
        chatId,
        "🤔 Question 1:\n\n" +
          "What happens at the event horizon of a black hole?",
        [
          [{ text: "Nothing can escape", callback_data: "answer_correct" }],
          [{ text: "Everything explodes", callback_data: "answer_wrong" }],
          [{ text: "Time stops completely", callback_data: "answer_partial" }],
        ]
      );
      break;

    case "answer_correct":
      const lessonReward = 5;
      const newBalanceAfterLesson = await updateUserBalance(
        chatId,
        lessonReward
      );
      const streak = await updateUserStreak(chatId);

      let streakBonus = 0;
      if (streak % 5 === 0) {
        streakBonus = 2;
        await updateUserBalance(chatId, streakBonus);
      }

      await sendMessage(
        chatId,
        `🎉 Brilliant! That's correct!\n\n` +
          `🧪 Rewards:\n` +
          `• Discovery Progress: +${lessonReward} $SCIENCE\n` +
          `${streakBonus ? `• Streak Bonus: +${streakBonus} $SCIENCE\n` : ""}` +
          `• Current Balance: ${newBalanceAfterLesson} $SCIENCE\n\n` +
          `📚 Learning Streak: ${streak} days\n\n` +
          `💡 Fun Fact: The event horizon is like a cosmic point of no return - once anything crosses it, it can never escape the black hole's gravitational pull!`,
        [
          [{ text: "➡️ Next Question", callback_data: "question_2" }],
          [{ text: "📊 View Progress", callback_data: "check_balance" }],
        ]
      );
      break;

    case "daily_fact":
      const factReward = 3;
      const factBalance = await updateUserBalance(chatId, factReward);

      await sendMessage(
        chatId,
        "🧪 Today's Science Fact:\n\n" +
          "Did you know? DNA is like a twisted ladder that could stretch from Earth to the Sun and back 600 times if you uncoiled all the DNA in your body!\n\n" +
          `🎓 Reward: +${factReward} $SCIENCE\n` +
          `Current Balance: ${factBalance} $SCIENCE`,
        [
          [{ text: "🔬 Learn More", callback_data: "daily_discovery" }],
          [{ text: "🎯 Take Quiz", callback_data: "quiz" }],
        ]
      );
      break;

    case "check_balance":
      const balance = userBalances.get(chatId) || 0;
      const currentStreak = userStreaks.get(chatId) || 0;

      await sendMessage(
        chatId,
        "🎓 Your Science Progress:\n\n" +
          `Current Balance: ${balance} $SCIENCE\n\n` +
          `🔬 Learning Streak: ${currentStreak} days\n\n` +
          "Earn more by:\n" +
          "• Complete discovery: +10 $SCIENCE\n" +
          "• Do experiment: +5 $SCIENCE\n" +
          "• Learn fact: +3 $SCIENCE\n" +
          "• Take quiz: +2 $SCIENCE\n" +
          "• 5-day streak bonus: +2 $SCIENCE\n\n" +
          "🏆 Achievements:\n" +
          "• Quantum Explorer 🌌\n" +
          "• Lab Master 🧪\n" +
          "• Science Enthusiast 🔬",
        [
          [{ text: "🌌 New Discovery", callback_data: "daily_discovery" }],
          [{ text: "🔄 Main Menu", callback_data: "/start" }],
        ]
      );
      break;

    case "experiment":
      await sendMessage(
        chatId,
        "⚡ Quick Experiment: Static Electricity\n\n" +
          "Materials needed:\n" +
          "• Balloon 🎈\n" +
          "• Your hair (or wool cloth)\n\n" +
          "Steps:\n" +
          "1. Inflate the balloon\n" +
          "2. Rub it on your hair\n" +
          "3. Hold it near small paper pieces\n\n" +
          "What do you observe?",
        [
          [
            {
              text: "Paper attracts to balloon",
              callback_data: "experiment_correct",
            },
          ],
          [{ text: "Nothing happens", callback_data: "experiment_wrong" }],
          [{ text: "Balloon pops", callback_data: "experiment_wrong" }],
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
