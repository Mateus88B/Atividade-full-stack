const DiaryEntry = require('../models/DiaryEntry');

exports.listEntries = async (req, res) => {
  try {
    const entries = await DiaryEntry.find().sort({ happenedAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar registros.' });
  }
};

exports.getEntryById = async (req, res) => {
  try {
    const entry = await DiaryEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Registro não encontrado.' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar registro.' });
  }
};

exports.createEntry = async (req, res) => {
  try {
    const entry = await DiaryEntry.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar registro.', details: error.message });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const entry = await DiaryEntry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!entry) {
      return res.status(404).json({ message: 'Registro não encontrado.' });
    }

    res.json(entry);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar registro.', details: error.message });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const entry = await DiaryEntry.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Registro não encontrado.' });
    }

    res.json({ message: 'Registro removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir registro.' });
  }
};
