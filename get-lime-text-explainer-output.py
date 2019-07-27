import json

from lime.lime_text import LimeTextExplainer
import numpy as np
import sklearn
import sklearn.ensemble
import sklearn.metrics
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.datasets import fetch_20newsgroups

categories = ['alt.atheism', 'soc.religion.christian']
newsgroups_train = fetch_20newsgroups(subset='train', categories=categories)
newsgroups_test = fetch_20newsgroups(subset='test', categories=categories)
class_names = ['atheism', 'christian']

vectorizer = sklearn.feature_extraction.text.TfidfVectorizer(lowercase=False)
train_vectors = vectorizer.fit_transform(newsgroups_train.data)
test_vectors = vectorizer.transform(newsgroups_test.data)

rf = sklearn.ensemble.RandomForestClassifier(n_estimators=500)
rf.fit(train_vectors, newsgroups_train.target)

pred = rf.predict(test_vectors)
score = sklearn.metrics.f1_score(newsgroups_test.target, pred, average='binary')
print(score)

c = make_pipeline(vectorizer, rf)

explainer = LimeTextExplainer(class_names=class_names)

idx = 83
exp = explainer.explain_instance(newsgroups_test.data[idx], c.predict_proba, num_features=12)
print('Document id: %d' % idx)
print('Probability(christian) =', c.predict_proba([newsgroups_test.data[idx]])[0,1])
print('True class: %s' % class_names[newsgroups_test.target[idx]])

print(exp.as_list())

print('Original prediction:', rf.predict_proba(test_vectors[idx])[0,1])
tmp = test_vectors[idx].copy()
tmp[0,vectorizer.vocabulary_['Posting']] = 0
tmp[0,vectorizer.vocabulary_['Host']] = 0
print('Prediction removing some features:', rf.predict_proba(tmp)[0,1])
print('Difference:', rf.predict_proba(tmp)[0,1] - rf.predict_proba(test_vectors[idx])[0,1])

text_data = exp.domain_mapper.indexed_string.raw_string()
with open("data/text-data.txt", "w") as f:
    f.write(text_data)

local_exp = [{"label": text_word, "proba": abs(contrib_proba), "group": class_names[int(contrib_proba > 0)]} for text_word, contrib_proba in exp.domain_mapper.map_exp_ids(exp.local_exp[1])]
with open("data/local-exp.json", "w") as f:
    json.dump(local_exp, f)

predict_proba = [{"label": class_name, "proba": predict_proba, "group": class_name} for class_name, predict_proba in zip(exp.class_names, exp.predict_proba)]
with open("data/predict-proba.json", "w") as f:
    json.dump(predict_proba, f)

newsgroups_train = fetch_20newsgroups(subset='train', remove=('headers', 'footers', 'quotes'))
newsgroups_test = fetch_20newsgroups(subset='test',remove=('headers', 'footers', 'quotes'))
class_names = [x.split('.')[-1] if 'misc' not in x else '.'.join(x.split('.')[-2:]) for x in newsgroups_train.target_names]
train_vectors = vectorizer.fit_transform(newsgroups_train.data)
test_vectors = vectorizer.transform(newsgroups_test.data)
nb = MultinomialNB(alpha=.01)
nb.fit(train_vectors, newsgroups_train.target)
c = make_pipeline(vectorizer, nb)
explainer = LimeTextExplainer(class_names=class_names)
idx = 1340
exp = explainer.explain_instance(newsgroups_test.data[idx], c.predict_proba, num_features=6, top_labels=3)