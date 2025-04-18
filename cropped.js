// // Get all boat owners
// router.get('/users', async (req, res) => {
//   try {
//     const userRes = await User.find();
//     res.json(userRes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// app.get('/destinations/:id', async (req, res) => {
//   try {
//       const destination = await Destination.findById(req.params.id);

//       if (!destination) {
//           return res.status(404).send({ message: 'Destination not found' });
//       }

//       res.status(200).send(destination);
//   } catch (error) {
//       res.status(500).send({ message: 'Internal Server Error', error: error.message });
//   }
// });