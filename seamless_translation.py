from transformers import AutoProcessor, SeamlessM4TModel
processor = AutoProcessor.from_pretrained("facebook/hf-seamless-m4t-medium")
model = SeamlessM4TModel.from_pretrained("facebook/hf-seamless-m4t-medium")

def translation(txt,src_lango, tgt_lango):

  # now, process some English test as well
  text_inputs = processor(text = txt, src_lang=src_lango, return_tensors="pt")
  # from text
  output_tokens = model.generate(**text_inputs, tgt_lang=tgt_lango, generate_speech=False)
  translated_text = processor.decode(output_tokens[0].tolist()[0], skip_special_tokens=True)
  return translated_text
